import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านลับคมอุดรธานี";
const FULL_NAME = `${SHOP_NAME} By ช่างเจี๊ยบ`;
const DESCRIPTION =
  "ร้านลับคมอุดรธานี By ช่างเจี๊ยบ รับลับกรรไกรตัดผม ปัตตาเลี่ยน มีดครัว มีดแล่ปลา ใบเลื่อย ใบมีดวงกลม มีหน้าร้านในเมืองอุดรฯ ส่งรูปทางไลน์ให้ช่างประเมินราคาก่อนได้ โทร 084-428-3946";

// โหลดฟอนต์มาเก็บในแอป (self-host) — ใช้งานออฟไลน์ได้ ไม่มีตัวอักษรกระพริบ
const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-thai",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ร้านลับคมอุดรธานี ลับกรรไกร มีด ปัตตาเลี่ยน | ช่างเจี๊ยบ",
    template: "%s | ร้านลับคมอุดรธานี By ช่างเจี๊ยบ",
  },
  description: DESCRIPTION,
  applicationName: FULL_NAME,
  keywords: [
    "ร้านลับคมอุดรธานี",
    "ลับคมอุดร",
    "ลับกรรไกรอุดร",
    "ลับกรรไกรตัดผม อุดรธานี",
    "ร้านลับมีดอุดรธานี",
    "ลับปัตตาเลี่ยน อุดร",
    "ลับมีดครัว อุดรธานี",
    "ลับใบเลื่อย อุดร",
    "ร้านลับคมใกล้ฉัน",
    "ช่างเจี๊ยบ ลับคม",
  ],
  authors: [{ name: FULL_NAME }],
  creator: FULL_NAME,
  publisher: FULL_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: SITE_URL,
    siteName: FULL_NAME,
    title: "ร้านลับคมอุดรธานี By ช่างเจี๊ยบ — ลับกรรไกร มีด ปัตตาเลี่ยน",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "ร้านลับคมอุดรธานี By ช่างเจี๊ยบ",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // ยืนยันความเป็นเจ้าของกับ Google Search Console (token นี้เป็นค่าสาธารณะ — meta tag
  // ในหน้าเว็บ; Google แนะนำให้คงไว้ถาวร) ตั้ง env ทับได้ถ้าต้องการเปลี่ยน
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      "kAEh8xoNE3f3BI9BjzMPoglM-hfjdz7oVoME2T4WVIA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070806",
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
