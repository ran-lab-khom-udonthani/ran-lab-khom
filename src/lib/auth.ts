import "server-only";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "khom_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 วัน

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("ยังไม่ได้ตั้งค่า AUTH_SECRET ในไฟล์ .env");
  return new TextEncoder().encode(secret);
}

// ตรวจรหัสผ่านพนักงาน
export function checkStaffPassword(password: string): boolean {
  const expected = process.env.STAFF_PASSWORD;
  if (!expected) throw new Error("ยังไม่ได้ตั้งค่า STAFF_PASSWORD ในไฟล์ .env");
  // เทียบแบบ constant-time (แฮชก่อนเพื่อให้ความยาวเท่ากันเสมอ) กัน timing attack
  const a = createHash("sha256").update(password).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

// สร้างเซสชันหลังล็อกอินสำเร็จ
export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "staff" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// เช็คว่าล็อกอินอยู่ไหม (สำหรับ server component / action)
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}
