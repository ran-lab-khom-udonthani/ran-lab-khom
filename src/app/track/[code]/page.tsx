import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_META, STATUS_ORDER } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { formatBaht, formatThaiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านลับคมอุดรธานี";

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
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl">🔍</div>
        <h1 className="text-xl font-bold text-slate-900">ไม่พบงานรหัสนี้</h1>
        <p className="text-slate-500">
          รหัส <span className="font-mono font-semibold">{code}</span>{" "}
          ไม่ถูกต้องหรือถูกลบไปแล้ว กรุณาตรวจสอบใบรับงานอีกครั้ง
        </p>
        <Link
          href="/"
          className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-700"
        >
          ลองค้นหาอีกครั้ง
        </Link>
      </main>
    );
  }

  const currentIdx = TIMELINE.indexOf(job.status as (typeof TIMELINE)[number]);
  const isCancelled = job.status === "CANCELLED";
  const message = CUSTOMER_MESSAGE[job.status] ?? "";

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 py-8">
      {/* หัว */}
      <div className="text-center">
        <div className="text-3xl">🔪✂️</div>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{SHOP_NAME}</h1>
      </div>

      {/* การ์ดสถานะ */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="text-sm text-slate-400">รหัสงาน</div>
          <div className="font-mono text-3xl font-bold tracking-wider text-slate-900">
            {job.code}
          </div>
          <div className="mt-3 flex justify-center">
            <StatusBadge status={job.status} size="lg" />
          </div>
          {message && (
            <p className="mt-3 text-slate-600">{message}</p>
          )}
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div className="mt-6 space-y-0">
            {TIMELINE.map((s, i) => {
              const meta = STATUS_META[s];
              const done = currentIdx >= 0 && i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={s} className="flex gap-3">
                  {/* เส้น + จุด */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-base ${
                        done
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-300"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div
                        className={`h-8 w-0.5 ${
                          i < currentIdx ? "bg-slate-900" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className={`pb-3 text-lg ${isCurrent ? "font-semibold" : ""}`}>
                    <div
                      className={done ? "text-slate-900" : "text-slate-400"}
                    >
                      {meta.emoji} {meta.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* รายละเอียดงาน */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">รายการคม</h2>
        <ul className="space-y-2">
          {job.items.map((it) => (
            <li
              key={it.id}
              className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 text-lg last:border-0"
            >
              <span>
                🔪 {it.kind}
                {it.description && (
                  <span className="block text-xs text-slate-400">
                    {it.description}
                  </span>
                )}
                {it.quantity > 1 && (
                  <span className="text-slate-400"> ×{it.quantity}</span>
                )}
              </span>
              <span className="shrink-0 tabular-nums text-slate-600">
                {formatBaht(it.quantity * it.unitPrice)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between border-t-2 border-slate-200 pt-3">
          <span className="font-semibold text-slate-900">รวมทั้งหมด</span>
          <span className="text-xl font-bold tabular-nums text-slate-900">
            {formatBaht(job.totalPrice)}
          </span>
        </div>
        <div className="mt-1 text-right text-sm">
          {job.paid ? (
            <span className="text-green-600">ชำระเงินแล้ว ✅</span>
          ) : (
            <span className="text-orange-600">ยังไม่ชำระเงิน</span>
          )}
        </div>

        <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">วันรับงาน</dt>
            <dd className="text-slate-700">{formatThaiDate(job.receivedAt)}</dd>
          </div>
          {job.readyBy && (
            <div className="flex justify-between">
              <dt className="text-slate-400">วันนัดรับ</dt>
              <dd className="text-slate-700">{formatThaiDate(job.readyBy)}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        อัปเดตอัตโนมัติเมื่อร้านเปลี่ยนสถานะงาน
      </div>
    </main>
  );
}
