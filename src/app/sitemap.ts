import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// แผนผังเว็บสำหรับ Google — ใส่เฉพาะหน้าสาธารณะที่ต้องการให้ index
// (ไม่รวม /admin, /track/[code], /api ซึ่งกัน index ด้วย noindex/robots แยกต่างหาก)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
