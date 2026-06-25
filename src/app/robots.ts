import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// robots.txt — อนุญาตให้เก็บหน้าสาธารณะ ชี้ไป sitemap
// ไม่ Disallow /admin และ /track เพราะถ้ากัน crawl บอตจะอ่าน meta noindex ไม่เจอ
// (หน้าเหล่านั้นกัน index ด้วย robots:{index:false} ในไฟล์ของมันเอง)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
