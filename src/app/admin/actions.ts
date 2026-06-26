"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { put, del } from "@vercel/blob";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import {
  checkStaffPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/auth";
import { generateJobCode, parseDateInput } from "@/lib/utils";
import {
  isValidStatus,
  isValidRequestStatus,
  isValidGalleryCategory,
  GALLERY_CATEGORIES,
} from "@/lib/constants";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

// ---------- ล็อกอิน / ออกจากระบบ ----------

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkStaffPassword(password)) {
    // หน่วงเวลาเมื่อรหัสผิด เพื่อชะลอการเดารหัสแบบอัตโนมัติ (brute-force)
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { error: "รหัสผ่านไม่ถูกต้อง" };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- รับงานใหม่ ----------

async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const code = generateJobCode();
    const exists = await prisma.job.findUnique({ where: { code } });
    if (!exists) return code;
  }
  // เผื่อชนกันบ่อยมาก ใช้ timestamp ต่อท้าย
  return `KH-${Date.now().toString(36).toUpperCase()}`;
}

type ParsedItem = {
  kind: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
};

function parseItems(formData: FormData): ParsedItem[] {
  const kinds = formData.getAll("itemKind").map(String);
  const descs = formData.getAll("itemDesc").map(String);
  const qtys = formData.getAll("itemQty").map(String);
  const prices = formData.getAll("itemPrice").map(String);

  const items: ParsedItem[] = [];
  for (let i = 0; i < kinds.length; i++) {
    const kind = (kinds[i] ?? "").trim();
    const quantity = Math.max(1, parseInt(qtys[i] ?? "1", 10) || 1);
    const unitPrice = Math.max(0, parseInt(prices[i] ?? "0", 10) || 0);
    if (!kind) continue; // ข้ามแถวว่าง
    items.push({
      kind,
      description: (descs[i] ?? "").trim() || null,
      quantity,
      unitPrice,
    });
  }
  return items;
}

export async function createJobAction(formData: FormData) {
  await requireAuth();

  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerPhone =
    String(formData.get("customerPhone") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const readyBy = parseDateInput(formData.get("readyBy"));
  const items = parseItems(formData);

  if (items.length === 0) {
    throw new Error("กรุณาเพิ่มรายการคมอย่างน้อย 1 รายการ");
  }

  const totalPrice = items.reduce(
    (sum, it) => sum + it.quantity * it.unitPrice,
    0
  );
  // สร้างงานแบบ retry — ถ้ารหัสชนกัน (race) ให้สุ่มใหม่แล้วลองอีกครั้ง
  let job: Awaited<ReturnType<typeof prisma.job.create>> | undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = await uniqueCode();
    const name = customerName || `ลูกค้า ${code}`;
    try {
      job = await prisma.job.create({
        data: {
          code,
          customerName: name,
          customerPhone,
          note,
          readyBy,
          totalPrice,
          items: { create: items },
        },
      });
      break;
    } catch (e) {
      const dup =
        e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
      if (dup && attempt < 4) continue; // รหัสซ้ำ สุ่มใหม่
      throw e;
    }
  }
  if (!job) throw new Error("สร้างงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");

  revalidatePath("/admin");
  redirect(`/admin/jobs/${job.id}?new=1`);
}

// ---------- อัปเดตสถานะ ----------

export async function updateStatusAction(formData: FormData) {
  await requireAuth();
  const jobId = String(formData.get("jobId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!jobId || !isValidStatus(status)) {
    throw new Error("ข้อมูลไม่ถูกต้อง");
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("ไม่พบงาน");

  const now = new Date();
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status,
      // ตั้งเวลาครั้งแรกที่เข้าสถานะนั้น และ "ไม่ลบ" ของเดิมเมื่อถอยสถานะ/ยกเลิก
      doneAt:
        status === "DONE" || status === "PICKED_UP"
          ? job.doneAt ?? now
          : job.doneAt,
      pickedUpAt:
        status === "PICKED_UP" ? job.pickedUpAt ?? now : job.pickedUpAt,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/jobs/${jobId}`);
}

// ---------- ชำระเงิน ----------

export async function togglePaidAction(formData: FormData) {
  await requireAuth();
  const jobId = String(formData.get("jobId") ?? "");
  if (!jobId) throw new Error("ข้อมูลไม่ถูกต้อง");

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("ไม่พบงาน");

  await prisma.job.update({
    where: { id: jobId },
    data: { paid: !job.paid },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath("/admin");
}

// ---------- แก้ไขรายละเอียดลูกค้า/โน้ต ----------

export async function updateJobDetailsAction(formData: FormData) {
  await requireAuth();
  const jobId = String(formData.get("jobId") ?? "");
  if (!jobId) throw new Error("ข้อมูลไม่ถูกต้อง");

  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerPhone =
    String(formData.get("customerPhone") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const readyBy = parseDateInput(formData.get("readyBy"));

  if (!customerName) throw new Error("กรุณากรอกชื่อลูกค้า");

  await prisma.job.update({
    where: { id: jobId },
    data: { customerName, customerPhone, note, readyBy },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath("/admin");
  redirect(`/admin/jobs/${jobId}`);
}

// ---------- ลบงาน ----------

export async function deleteJobAction(formData: FormData) {
  await requireAuth();
  const jobId = String(formData.get("jobId") ?? "");
  if (!jobId) throw new Error("ข้อมูลไม่ถูกต้อง");

  try {
    await prisma.job.delete({ where: { id: jobId } });
  } catch (e) {
    // ถ้างานถูกลบไปแล้ว (เช่น กดซ้ำ) ถือว่าสำเร็จ
    const gone =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";
    if (!gone) throw e;
  }
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- คำขอลับคมออนไลน์ ----------

export async function updateRequestStatusAction(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !isValidRequestStatus(status)) {
    throw new Error("ข้อมูลไม่ถูกต้อง");
  }
  await prisma.jobRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}

export async function deleteRequestAction(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ข้อมูลไม่ถูกต้อง");
  try {
    await prisma.jobRequest.delete({ where: { id } });
  } catch (e) {
    const gone =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";
    if (!gone) throw e;
  }
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}

// ---------- แกลเลอรีรูปงาน ----------

// ให้ AI (Claude Haiku) ดูรูปแล้วเลือกหมวด — ใช้เมื่อผู้ใช้เลือกโหมด "AUTO"
async function classifyGalleryCategory(
  buffer: Buffer,
  mediaType: "image/webp" | "image/jpeg" = "image/webp"
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ยังไม่ได้เปิด AI แยกหมวด (ต้องตั้งค่า ANTHROPIC_API_KEY) — หรือเลือกหมวดเองก่อนอัป"
    );
  }
  const anthropic = new Anthropic();
  const list = GALLERY_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 16,
    system:
      "คุณช่วยจัดหมวดรูปงานลับคมของร้าน ดูรูปแล้วเลือกหมวดที่ตรงที่สุด ตอบเฉพาะตัวเลขหมวดเท่านั้น",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: buffer.toString("base64"),
            },
          },
          {
            type: "text",
            text: `รูปนี้เป็นเครื่องมือมีคมประเภทไหน เลือก 1 หมวดที่ตรงที่สุด แล้วตอบเฉพาะตัวเลข (1-${GALLERY_CATEGORIES.length}):\n${list}`,
          },
        ],
      },
    ],
  });
  let raw = "";
  for (const b of msg.content) {
    if (b.type === "text") {
      raw = b.text;
      break;
    }
  }
  const match = raw.match(/\d+/);
  const idx = match ? parseInt(match[0], 10) - 1 : -1;
  if (idx >= 0 && idx < GALLERY_CATEGORIES.length) {
    return GALLERY_CATEGORIES[idx];
  }
  // เดาไม่ได้ → ใส่หมวด "เครื่องมือเฉพาะทาง" (หมวดสุดท้าย) เป็นค่าเริ่มต้น
  return GALLERY_CATEGORIES[GALLERY_CATEGORIES.length - 1];
}

// อัปรูป 1 ไฟล์ (ฝั่ง client ย่อ+แปลงมาแล้ว) ขึ้น Vercel Blob + บันทึก DB
// คืนผลเป็น object (ไม่ throw) เพื่อให้ฝั่งหน้าเว็บโชว์สาเหตุจริงได้ (Next ปกปิดข้อความ throw ใน production)
export async function uploadGalleryPhotoAction(
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "หมดเวลาเข้าสู่ระบบ กรุณาล็อกอินใหม่" };
  }
  try {
    const file = formData.get("file");
    let category = String(formData.get("category") ?? "").trim();
    const caption = String(formData.get("caption") ?? "").trim() || null;

    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "ไม่พบไฟล์รูป" };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { ok: false, error: "ไฟล์ใหญ่เกินไป (เกิน 8MB)" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isJpeg =
      file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg");
    const contentType = isJpeg ? "image/jpeg" : "image/webp";
    const ext = isJpeg ? "jpg" : "webp";

    // โหมด AUTO = ให้ AI แยกหมวดให้; ไม่งั้นใช้หมวดที่ผู้ใช้เลือก
    if (category === "AUTO") {
      category = await classifyGalleryCategory(buffer, contentType);
    } else if (!isValidGalleryCategory(category)) {
      return { ok: false, error: "หมวดไม่ถูกต้อง" };
    }

    const blob = await put(`gallery/${randomUUID()}.${ext}`, buffer, {
      access: "public",
      contentType,
    });

    await prisma.galleryPhoto.create({
      data: { url: blob.url, category, caption },
    });

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "อัปไม่สำเร็จ" };
  }
}

// ลบรูปออกจากแกลเลอรี (ลบไฟล์บน Blob + record ใน DB)
export async function deleteGalleryPhotoAction(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ข้อมูลไม่ถูกต้อง");

  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (photo) {
    try {
      await del(photo.url);
    } catch {
      // ลบไฟล์บน blob ไม่สำเร็จก็ลบ record ต่อ (กันรูปค้างในระบบ)
    }
    try {
      await prisma.galleryPhoto.delete({ where: { id } });
    } catch (e) {
      const gone =
        e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";
      if (!gone) throw e;
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
