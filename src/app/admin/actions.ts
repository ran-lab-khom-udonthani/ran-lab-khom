"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  checkStaffPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/auth";
import { generateJobCode, parseDateInput } from "@/lib/utils";
import { isValidStatus } from "@/lib/constants";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

// ---------- ล็อกอิน / ออกจากระบบ ----------

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkStaffPassword(password)) {
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
  const code = await uniqueCode();
  const name = customerName || `ลูกค้า ${code}`;

  const job = await prisma.job.create({
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

  const now = new Date();
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status,
      doneAt:
        status === "DONE" || status === "PICKED_UP" ? now : null,
      pickedUpAt: status === "PICKED_UP" ? now : null,
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

  await prisma.job.delete({ where: { id: jobId } });
  revalidatePath("/admin");
  redirect("/admin");
}
