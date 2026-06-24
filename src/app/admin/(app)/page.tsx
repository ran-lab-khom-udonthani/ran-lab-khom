import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_META, STATUS_ORDER, isValidStatus } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { formatBaht, formatThaiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const activeStatus = sp.status && isValidStatus(sp.status) ? sp.status : null;

  const [jobs, grouped] = await Promise.all([
    prisma.job.findMany({
      where: activeStatus ? { status: activeStatus } : undefined,
      include: { items: true },
      orderBy: { receivedAt: "desc" },
      take: 200,
    }),
    prisma.job.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const counts: Record<string, number> = {};
  let total = 0;
  for (const g of grouped) {
    counts[g.status] = g._count._all;
    total += g._count._all;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-neutral-900">คิวงาน</h1>

      {/* แท็บกรองสถานะ — ชิปใหญ่ เลื่อนแนวนอนได้ */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        <FilterTab label="ทั้งหมด" count={total} href="/admin" active={!activeStatus} />
        {STATUS_ORDER.map((s) => (
          <FilterTab
            key={s}
            label={`${STATUS_META[s].emoji} ${STATUS_META[s].label}`}
            count={counts[s] ?? 0}
            href={`/admin?status=${s}`}
            active={activeStatus === s}
          />
        ))}
      </div>

      {/* รายการงาน */}
      {jobs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center text-xl text-slate-400">
          ยังไม่มีงานในหมวดนี้
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const itemSummary = job.items
              .map(
                (it) => `${it.kind}${it.quantity > 1 ? `×${it.quantity}` : ""}`
              )
              .join(", ");
            return (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="block min-h-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm active:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl font-bold text-neutral-900">
                    {job.customerName}
                  </span>
                  <StatusBadge status={job.status} size="md" />
                </div>

                <p className="mt-1 text-lg text-slate-500 th-wrap">
                  <span className="font-mono">{job.code}</span>
                  {" · "}
                  {itemSummary || "—"}
                </p>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xl font-bold tabular-nums text-neutral-900">
                    {formatBaht(job.totalPrice)}
                  </span>
                  {job.status !== "CANCELLED" &&
                    (job.paid ? (
                      <span className="rounded-full bg-green-700 px-3 py-1 text-lg font-semibold text-white">
                        จ่ายแล้ว
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-400 px-3 py-1 text-lg font-semibold text-black">
                        ค้างจ่าย
                      </span>
                    ))}
                </div>

                <p className="mt-1 text-lg text-slate-500">
                  รับ {formatThaiDate(job.receivedAt)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  label,
  count,
  href,
  active,
}: {
  label: string;
  count: number;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-14 items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 text-xl font-semibold tabular-nums th-nowrap ${
        active
          ? "border-blue-700 bg-blue-600 text-white"
          : "border-slate-300 bg-white text-slate-700"
      }`}
    >
      {label} {count}
    </Link>
  );
}
