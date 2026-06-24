/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ยังไม่ได้ติดตั้ง eslint ในโปรเจคนี้ — ข้ามตอน build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
