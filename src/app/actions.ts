"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { REQUEST_CATEGORIES } from "@/lib/constants";

// รับคำขอลับคมจากหน้าร้าน (สาธารณะ — ไม่ต้องล็อกอิน)
export async function createRequestAction(_prev: unknown, formData: FormData) {
  const customerName =
    String(formData.get("customerName") ?? "").trim().slice(0, 100) || null;
  const customerPhone =
    String(formData.get("customerPhone") ?? "").trim().slice(0, 30) || null;
  const note = String(formData.get("note") ?? "").trim().slice(0, 500) || null;

  const allowed = new Set<string>(REQUEST_CATEGORIES as readonly string[]);
  const categories = Array.from(
    new Set(
      formData
        .getAll("category")
        .map((c) => String(c).trim())
        .filter((c) => allowed.has(c))
    )
  );

  if (categories.length === 0) {
    return { ok: false as const, error: "กรุณาเลือกอย่างน้อย 1 หมวด" };
  }
  if (!customerPhone) {
    return {
      ok: false as const,
      error: "กรุณากรอกเบอร์โทร เพื่อให้ร้านติดต่อกลับได้",
    };
  }

  await prisma.jobRequest.create({
    data: { customerName, customerPhone, note, categories },
  });

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
  return { ok: true as const };
}
