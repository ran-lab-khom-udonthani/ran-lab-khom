import "server-only";
import { headers } from "next/headers";

// คำนวณ base URL จาก request header — ใช้สร้างลิงก์ QR ให้สแกนได้จริง
export async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}
