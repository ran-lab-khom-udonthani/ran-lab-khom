import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/baseUrl";
import { StatusBadge } from "@/components/StatusBadge";
import { AdvanceStatus, StatusControls } from "@/components/StatusControls";
import { DeleteJobButton } from "@/components/DeleteJobButton";
import { formatBaht, formatThaiDate, formatThaiDateTime } from "@/lib/utils";
import { togglePaidAction, updateJobDetailsAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

function toDateInput(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { id } = await params;
  const { new: isNew } = await searchParams;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
  if (!job) notFound();

  const trackUrl = `${await getBaseUrl()}/track/${job.code}`;

  return (
    <div className="space-y-5">
      <Link
        href="/admin"
        className="inline-flex min-h-12 items-center text-lg font-medium text-slate-500 active:text-slate-900"
      >
        ← คิวงาน
      </Link>

      {isNew && (
        <div className="rounded-2xl border border-green-300 bg-green-50 p-4 text-xl text-green-800">
          ✅ รับงานเรียบร้อย! พิมพ์ใบรับของพร้อม QR ให้ลูกค้าได้เลย
        </div>
      )}

      {/* ส่วนอ่าน — รหัส/ชื่อ/สถานะ */}
      <div className="space-y-2">
        <div className="font-mono text-3xl font-bold text-neutral-900">
          {job.code}
        </div>
        <div className="text-2xl text-neutral-900">{job.customerName}</div>
        {job.customerPhone && (
          <div className="text-lg text-slate-500 tabular-nums">
            📞 {job.customerPhone}
          </div>
        )}
        <div>
          <StatusBadge status={job.status} size="lg" />
        </div>
      </div>

      {/* ปุ่มจ่ายเงิน — แตะทีเดียว */}
      <form action={togglePaidAction}>
        <input type="hidden" name="jobId" value={job.id} />
        <button
          type="submit"
          className={`flex w-full min-h-14 items-center justify-center gap-2 rounded-xl px-4 text-xl font-bold ${
            job.paid
              ? "bg-green-700 text-white active:bg-green-800"
              : "bg-amber-400 text-black active:bg-amber-500"
          }`}
        >
          {job.paid ? "✓ จ่ายเงินแล้ว" : "💰 ยังไม่จ่าย — แตะเมื่อรับเงิน"}
        </button>
      </form>

      {/* เปลี่ยนสถานะอื่น (รอง) */}
      <details className="rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-xl font-semibold text-neutral-900">
          เปลี่ยนสถานะอื่น
        </summary>
        <div className="mt-4">
          <StatusControls jobId={job.id} current={job.status} />
        </div>
      </details>

      {/* รายการคม — แบบการ์ด */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-neutral-900">รายการคม</h2>
        {job.items.map((it) => (
          <div
            key={it.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="min-w-0">
              <div className="text-xl font-semibold text-neutral-900">
                {it.kind}
              </div>
              {it.description && (
                <div className="text-lg text-slate-500 th-wrap">
                  {it.description}
                </div>
              )}
              <div className="text-lg text-slate-500 tabular-nums">
                {it.quantity} × {formatBaht(it.unitPrice)}
              </div>
            </div>
            <div className="text-xl font-bold tabular-nums text-neutral-900">
              {formatBaht(it.quantity * it.unitPrice)}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-4">
          <span className="text-xl font-semibold text-neutral-900">
            รวมทั้งหมด
          </span>
          <span className="text-2xl font-bold tabular-nums text-neutral-900">
            {formatBaht(job.totalPrice)}
          </span>
        </div>
      </section>

      {/* การจัดการ */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-neutral-900">การจัดการ</h2>

        <Link href={`/admin/jobs/${job.id}/print`} className="btn-secondary">
          🖨️ พิมพ์ใบรับของ
        </Link>

        {/* QR */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr?data=${encodeURIComponent(trackUrl)}`}
            alt="QR เช็คสถานะ"
            width={240}
            height={240}
            className="mx-auto"
          />
          <Link
            href={`/track/${job.code}`}
            target="_blank"
            className="mt-2 inline-block break-all text-base text-slate-400 underline-offset-2"
          >
            {trackUrl}
          </Link>
        </div>

        {/* แก้ไขข้อมูล */}
        <details className="rounded-2xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-xl font-semibold text-neutral-900">
            ✏️ แก้ไขข้อมูล
          </summary>
          <form action={updateJobDetailsAction} className="mt-4 space-y-4">
            <input type="hidden" name="jobId" value={job.id} />
            <div>
              <label className="mb-1 block text-lg font-medium text-slate-700">
                ชื่อลูกค้า
              </label>
              <input
                name="customerName"
                defaultValue={job.customerName}
                className="w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-lg font-medium text-slate-700">
                เบอร์โทร
              </label>
              <input
                name="customerPhone"
                type="tel"
                inputMode="tel"
                defaultValue={job.customerPhone ?? ""}
                className="w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-lg font-medium text-slate-700">
                วันนัดรับ
              </label>
              <input
                type="date"
                name="readyBy"
                defaultValue={toDateInput(job.readyBy)}
                className="w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-lg font-medium text-slate-700">
                หมายเหตุ
              </label>
              <input
                name="note"
                defaultValue={job.note ?? ""}
                className="w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
              />
            </div>
            <button type="submit" className="btn-primary">
              บันทึกการแก้ไข
            </button>
          </form>
        </details>

        {/* วันที่ */}
        <dl className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-lg">
          <Row label="รับงาน" value={formatThaiDate(job.receivedAt)} />
          <Row label="นัดรับ" value={formatThaiDate(job.readyBy)} />
          {job.doneAt && (
            <Row label="เสร็จเมื่อ" value={formatThaiDateTime(job.doneAt)} />
          )}
          {job.pickedUpAt && (
            <Row label="รับของเมื่อ" value={formatThaiDateTime(job.pickedUpAt)} />
          )}
        </dl>
      </section>

      {/* เพิ่มเติม — ลบทิ้ง */}
      <section className="mt-8 border-t border-slate-200 pt-6">
        <h2 className="mb-3 text-2xl font-semibold text-neutral-900">เพิ่มเติม</h2>
        <DeleteJobButton jobId={job.id} />
      </section>

      {/* เว้นที่ให้แถบล่าง */}
      <div className="h-36" aria-hidden />

      {/* แถบล่าง — ปุ่มเลื่อนสถานะ */}
      <div className="fixed inset-x-0 bottom-[72px] z-30 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-4 pt-3 pb-3 backdrop-blur no-print">
        <AdvanceStatus jobId={job.id} current={job.status} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-neutral-900">{value}</dd>
    </div>
  );
}
