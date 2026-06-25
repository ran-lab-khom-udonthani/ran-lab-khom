// ฟังก์ชันช่วยจัดรูปแบบ — ใช้ได้ทั้ง server/client

export function formatBaht(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatThaiDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    calendar: "buddhist",
  }).format(d);
}

export function formatThaiDateTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    calendar: "buddhist",
  }).format(d);
}

// สร้างรหัสงานแบบอ่านง่าย เช่น KH-7F3A (ไม่ใช้ตัวที่สับสน 0/O/1/I)
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateJobCode(): string {
  // ใช้ตัวสุ่มเชิงเข้ารหัส (Web Crypto มีทั้งฝั่ง server/บราวเซอร์) + 6 หลัก
  // 32^6 ≈ 1.07 พันล้าน เดายาก และยังอ่านง่ายบนใบรับงาน
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  let body = "";
  for (let i = 0; i < bytes.length; i++) {
    // 256 หารด้วย 32 ลงตัว → ไม่มี modulo bias
    body += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return `KH-${body}`;
}

// แปลง input วันที่ (yyyy-mm-dd) เป็น Date หรือ null
export function parseDateInput(value: FormDataEntryValue | null): Date | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}
