// URL ฐานของเว็บ — แหล่งความจริงเดียว ใช้ร่วมกันใน metadata, sitemap, robots, JSON-LD
// เมื่อย้ายไปโดเมนของตัวเอง ให้ตั้ง NEXT_PUBLIC_SITE_URL ใน Vercel แล้วทุกที่จะเปลี่ยนตาม
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ran-lab-khom.vercel.app";
