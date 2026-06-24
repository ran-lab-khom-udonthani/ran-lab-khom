# 🔪 ร้านลับคมอุดรธานี — ระบบรับงาน & จัดการคิว

ระบบรับงานลับคม (กรรไกร, ปัตตาเลี่ยน, มีดแร่ปลา และคมอื่นๆ) สำหรับร้านและลูกค้า

- **ฝั่งพนักงาน** (`/admin`) — รับงานใหม่, จัดการคิว, อัปเดตสถานะ, พิมพ์ใบรับงานพร้อม QR
- **ฝั่งลูกค้า** (`/track/[รหัส]`) — สแกน QR หรือกรอกรหัสเพื่อเช็คสถานะงาน

## เทคโนโลยี

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma · SQLite (dev)

## เริ่มใช้งาน (ครั้งแรก)

```bash
npm install            # ติดตั้ง dependencies
npm run db:push        # สร้างฐานข้อมูลจาก schema
npm run db:seed        # (ทางเลือก) ใส่ข้อมูลตัวอย่าง
npm run dev            # รันเซิร์ฟเวอร์ที่ http://localhost:3000
```

เปิด <http://localhost:3000>

- หน้าหลัก: ช่องเช็คสถานะของลูกค้า
- เข้าระบบพนักงาน: <http://localhost:3000/admin> — รหัสผ่านเริ่มต้นคือ `udonkhom`
  (เปลี่ยนได้ที่ `STAFF_PASSWORD` ในไฟล์ `.env`)

## การตั้งค่า (.env)

| ตัวแปร | คำอธิบาย |
|--------|----------|
| `DATABASE_URL` | ที่อยู่ฐานข้อมูล (dev = SQLite) |
| `AUTH_SECRET` | กุญแจเซ็นเซสชันล็อกอิน — **สุ่มใหม่ก่อนขึ้นออนไลน์** |
| `STAFF_PASSWORD` | รหัสผ่านพนักงานร้าน |
| `NEXT_PUBLIC_SHOP_NAME` | ชื่อร้านที่แสดงบนหน้าจอ/ใบรับงาน |

## คำสั่งที่มีให้

| คำสั่ง | ทำอะไร |
|--------|--------|
| `npm run dev` | รันโหมดพัฒนา |
| `npm run build` | สร้างเวอร์ชันโปรดักชัน |
| `npm start` | รันเวอร์ชันโปรดักชัน |
| `npm run db:push` | อัปเดตฐานข้อมูลตาม schema |
| `npm run db:seed` | ใส่ข้อมูลตัวอย่าง |
| `npm run db:studio` | เปิด Prisma Studio ดู/แก้ข้อมูล |

## ขึ้นออนไลน์ (Vercel)

1. เปลี่ยน `provider` ใน `prisma/schema.prisma` เป็น `postgresql`
2. ใช้ Postgres ฟรีจาก [Neon](https://neon.tech) หรือ [Supabase](https://supabase.com) แล้วตั้ง `DATABASE_URL`
3. ตั้ง env (`AUTH_SECRET`, `STAFF_PASSWORD`, `NEXT_PUBLIC_SHOP_NAME`) บน Vercel
4. Deploy — QR Code จะชี้ไปยังโดเมนจริงอัตโนมัติ
