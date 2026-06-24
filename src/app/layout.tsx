import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านลับคมอุดรธานี";

// โหลดฟอนต์มาเก็บในแอป (self-host) — ใช้งานออฟไลน์ได้ ไม่มีตัวอักษรกระพริบ
const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-thai",
});

export const metadata: Metadata = {
  title: SHOP_NAME,
  description: "ระบบรับงานลับคม กรรไกร ปัตตาเลี่ยน มีดแร่ปลา และคมอื่นๆ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoThai.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
