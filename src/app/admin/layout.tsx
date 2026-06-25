import type { Metadata } from "next";

// กันทุกหน้าในส่วน /admin (รวมหน้า login และหน้าในกลุ่ม (app)) ออกจากผลค้นหา Google
// ที่เดียวครอบทั้งเซ็กเมนต์ — หน้า login เป็น client component จึง export metadata เองไม่ได้
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
