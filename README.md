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
| `DATABASE_URL` | Postgres connection string (pooled) |
| `DATABASE_URL_UNPOOLED` | Postgres connection **ตรง** (ไม่ผ่าน pooler) — ใช้ตอน `prisma db push` |
| `AUTH_SECRET` | กุญแจเซ็นเซสชันล็อกอิน — `openssl rand -hex 32` |
| `STAFF_PASSWORD` | รหัสผ่านพนักงาน — **ตั้งให้ยาว ≥16 ตัว** (ระบบไม่มี rate-limit เต็มรูปแบบ) |
| `NEXT_PUBLIC_SHOP_NAME` | ชื่อร้านที่แสดงบนหน้าจอ/ใบรับงาน |
| `NEXT_PUBLIC_LINE_URL` | ลิงก์ปุ่มแอด LINE หน้า Landing |
| `NEXT_PUBLIC_FACEBOOK_URL` | ลิงก์ปุ่ม Facebook หน้า Landing |

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

> schema เป็น PostgreSQL แล้ว และ `npm run build` จะรัน `prisma db push` สร้างตารางให้อัตโนมัติ

1. Import repo เข้า [Vercel](https://vercel.com)
2. เพิ่มฐานข้อมูล: Project → **Storage → Neon** — Neon จะตั้ง `DATABASE_URL` และ `DATABASE_URL_UNPOOLED` ให้อัตโนมัติ
   - ถ้าตั้งเอง: `DATABASE_URL_UNPOOLED` ต้องเป็น connection **ตรง (ไม่ผ่าน `-pooler`)** ไม่งั้น `prisma db push` ตอน build จะล้ม
3. ตั้ง env บน Vercel: `AUTH_SECRET` (`openssl rand -hex 32`), `STAFF_PASSWORD` (ยาว ≥16 ตัว), `NEXT_PUBLIC_SHOP_NAME`, `NEXT_PUBLIC_LINE_URL`, `NEXT_PUBLIC_FACEBOOK_URL`
   - ⚠️ ถ้าไม่ตั้ง `AUTH_SECRET`/`STAFF_PASSWORD` → build เขียวได้ แต่หน้า `/admin` จะ error 500 ตอนใช้งาน
4. Deploy — QR Code / ลิงก์เช็คสถานะจะชี้ไปยังโดเมนจริงอัตโนมัติ
