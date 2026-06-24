import Link from "next/link";
import { TrackLookupForm } from "@/components/TrackLookupForm";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านลับคมอุดรธานี";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <div className="mb-3 text-5xl">🔪✂️</div>
        <h1 className="text-3xl font-bold text-slate-900">{SHOP_NAME}</h1>
        <p className="mt-2 text-slate-500">
          ลับคม กรรไกร · ปัตตาเลี่ยน · มีดแร่ปลา · และคมอื่นๆ
        </p>
      </div>

      {/* ฝั่งลูกค้า: เช็คสถานะงาน */}
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          📱 เช็คสถานะงาน
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          กรอกรหัสงานบนใบรับงาน หรือสแกน QR Code
        </p>
        <TrackLookupForm />
      </section>

      {/* ฝั่งพนักงาน */}
      <Link
        href="/admin"
        className="text-sm font-medium text-slate-500 underline-offset-4 transition hover:text-slate-900 hover:underline"
      >
        🔐 สำหรับพนักงานร้าน — เข้าสู่ระบบ
      </Link>
    </main>
  );
}
