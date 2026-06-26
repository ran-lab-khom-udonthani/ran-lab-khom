/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ยังไม่ได้ติดตั้ง eslint ในโปรเจคนี้ — ข้ามตอน build
    ignoreDuringBuilds: true,
  },
  experimental: {
    // รองรับอัปโหลดรูป (ย่อ webp ในเครื่องก่อนแล้ว แต่เผื่อไฟล์ใหญ่)
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;
