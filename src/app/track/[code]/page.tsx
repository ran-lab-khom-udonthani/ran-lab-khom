import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_META, STATUS_ORDER } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { formatBaht, formatThaiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

// หน้าติดตามงานของลูกค้าแต่ละราย ไม่ควรอยู่ในผลค้นหา Google
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "ลับคมอุดรธานี";
const LINE_URL =
  process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/R/ti/p/~0844283946";

// ขั้นตอนที่แสดงใน timeline (ไม่รวมยกเลิก)
const TIMELINE: typeof STATUS_ORDER = [
  "PENDING",
  "IN_PROGRESS",
  "DONE",
  "PICKED_UP",
];

const CUSTOMER_MESSAGE: Record<string, string> = {
  PENDING: "รับงานแล้ว กำลังรอคิวดำเนินการ",
  IN_PROGRESS: "ช่างกำลังลับคมให้อยู่ 🛠️",
  DONE: "งานเสร็จแล้ว! มารับได้เลยครับ 🎉",
  PICKED_UP: "รับของเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ 🙏",
  CANCELLED: "งานนี้ถูกยกเลิก หากมีข้อสงสัยกรุณาติดต่อร้าน",
};

function BrandHeader() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2.5">
      <span className="grid h-11 w-11 place-items-center rounded-lg border border-amber-300/50 bg-amber-400 text-black shadow-[0_0_28px_rgba(245,158,11,0.32)]">
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M7 7l10 10M17 7 7 17" />
          <path d="M8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM20 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
        </svg>
      </span>
      <span className="text-left leading-tight">
        <span className="block text-lg font-black text-amber-300">
          {SHOP_NAME}
        </span>
        <span className="block text-xs font-bold text-white/70">
          By ช่างเจี๊ยบ
        </span>
      </span>
    </Link>
  );
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw).trim().toUpperCase();

  const job = await prisma.job.findUnique({
    where: { code },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });

  if (!job) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#070806] px-4 text-center text-white">
        <div className="text-5xl">🔍</div>
        <h1 className="text-2xl font-black text-white">ไม่พบงานรหัสนี้</h1>
        <p className="max-w-sm leading-8 text-zinc-300">
          รหัส{" "}
          <span className="font-mono font-bold text-amber-300">{code}</span>{" "}
          ไม่ถูกต้องหรือถูกลบไปแล้ว กรุณาตรวจสอบใบรับงานอีกครั้ง
        </p>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-full bg-amber-400 px-6 font-black text-black transition hover:bg-amber-300"
        >
          กลับหน้าหลัก
        </Link>
      </main>
    );
  }

  const currentIdx = TIMELINE.indexOf(job.status as (typeof TIMELINE)[number]);
  const isCancelled = job.status === "CANCELLED";
  const message = CUSTOMER_MESSAGE[job.status] ?? "";

  return (
    <main className="min-h-screen bg-[#070806] px-4 py-8 text-white">
      <div className="mx-auto max-w-md">
        <BrandHeader />

        {/* การ์ดสถานะ */}
        <div className="mt-6 rounded-2xl border border-amber-300/30 bg-black/60 p-6 shadow-[0_0_46px_rgba(0,0,0,0.55)]">
          <div className="text-center">
            <div className="text-sm font-bold text-amber-300/80">รหัสงาน</div>
            <div className="font-mono text-3xl font-black tracking-wider text-amber-300">
              {job.code}
            </div>
            <div className="mt-3 flex justify-center">
              <StatusBadge status={job.status} size="lg" />
            </div>
            {message && <p className="mt-3 text-zinc-200">{message}</p>}
          </div>

          {/* Timeline */}
          {!isCancelled && (
            <div className="mt-6">
              {TIMELINE.map((s, i) => {
                const meta = STATUS_META[s];
                const done = currentIdx >= 0 && i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-base ${
                          done
                            ? "border-amber-400 bg-amber-400 text-black"
                            : "border-white/20 bg-transparent text-zinc-500"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div
                          className={`h-8 w-0.5 ${
                            i < currentIdx ? "bg-amber-400" : "bg-white/15"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`pb-3 text-lg ${
                        isCurrent ? "font-black" : ""
                      }`}
                    >
                      <span className={done ? "text-white" : "text-zinc-500"}>
                        {meta.emoji} {meta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* รายละเอียดงาน */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-6">
          <h2 className="mb-3 font-black text-amber-300">รายการคม</h2>
          <ul className="space-y-2">
            {job.items.map((it) => (
              <li
                key={it.id}
                className="flex items-start justify-between gap-3 border-b border-white/10 pb-2 text-lg last:border-0"
              >
                <span className="text-zinc-100">
                  🔪 {it.kind}
                  {it.description && (
                    <span className="block text-sm text-zinc-400">
                      {it.description}
                    </span>
                  )}
                  {it.quantity > 1 && (
                    <span className="text-zinc-400"> ×{it.quantity}</span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums text-zinc-200">
                  {formatBaht(it.quantity * it.unitPrice)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between border-t-2 border-white/15 pt-3">
            <span className="font-black text-white">รวมทั้งหมด</span>
            <span className="text-xl font-black tabular-nums text-amber-300">
              {formatBaht(job.totalPrice)}
            </span>
          </div>
          <div className="mt-1 text-right text-sm">
            {job.paid ? (
              <span className="font-bold text-green-400">ชำระเงินแล้ว ✅</span>
            ) : (
              <span className="font-bold text-amber-300">ยังไม่ชำระเงิน</span>
            )}
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-400">วันรับงาน</dt>
              <dd className="text-zinc-100">{formatThaiDate(job.receivedAt)}</dd>
            </div>
            {job.readyBy && (
              <div className="flex justify-between">
                <dt className="text-zinc-400">วันนัดรับ</dt>
                <dd className="text-zinc-100">{formatThaiDate(job.readyBy)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* ติดต่อร้าน */}
        <a
          href={LINE_URL}
          className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#06c755] font-black text-white transition hover:brightness-110"
        >
          <span className="grid h-5 w-8 place-items-center rounded bg-white/20 text-[10px] font-black leading-none">
            LINE
          </span>
          สอบถามเพิ่มเติมทางไลน์
        </a>

        <p className="mt-5 text-center text-xs text-zinc-500">
          อัปเดตอัตโนมัติเมื่อร้านเปลี่ยนสถานะงาน
        </p>
      </div>
    </main>
  );
}
