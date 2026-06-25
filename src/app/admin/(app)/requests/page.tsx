import { prisma } from "@/lib/prisma";
import {
  REQUEST_STATUS_META,
  REQUEST_STATUS_ORDER,
  isValidRequestStatus,
  type RequestStatus,
} from "@/lib/constants";
import { formatThaiDateTime } from "@/lib/utils";
import { updateRequestStatusAction } from "@/app/admin/actions";
import { DeleteRequestButton } from "@/components/DeleteRequestButton";

export const dynamic = "force-dynamic";

function RequestBadge({ status }: { status: string }) {
  const meta = isValidRequestStatus(status)
    ? REQUEST_STATUS_META[status]
    : null;
  if (!meta) {
    return (
      <span className="rounded-full bg-slate-200 px-3 py-1 text-base font-bold text-slate-800">
        {status}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-base font-bold ${meta.badge}`}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

export default async function RequestsPage() {
  const requests = await prisma.jobRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const newCount = requests.filter((r) => r.status === "NEW").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">คำขอจากลูกค้า</h1>
        <p className="mt-1 text-lg text-slate-500">
          คำขอลับคมที่ส่งมาจากหน้าเว็บ {newCount > 0 && `· ใหม่ ${newCount} รายการ`}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center text-xl text-slate-400">
          ยังไม่มีคำขอจากลูกค้า
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-neutral-900">
                    {r.customerName || "ลูกค้า (ไม่ระบุชื่อ)"}
                  </div>
                  {r.customerPhone && (
                    <a
                      href={`tel:${r.customerPhone.replace(/[^0-9+]/g, "")}`}
                      className="text-xl font-semibold tabular-nums text-blue-700 underline-offset-2 active:underline"
                    >
                      📞 {r.customerPhone}
                    </a>
                  )}
                </div>
                <RequestBadge status={r.status} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {r.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-slate-100 px-3 py-1 text-lg font-medium text-slate-700"
                  >
                    🔪 {c}
                  </span>
                ))}
              </div>

              {r.note && (
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-lg text-slate-600">
                  📝 {r.note}
                </p>
              )}

              <p className="mt-2 text-base text-slate-400">
                ส่งเมื่อ {formatThaiDateTime(r.createdAt)}
              </p>

              {/* ปุ่มเปลี่ยนสถานะ + ลบ */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                {REQUEST_STATUS_ORDER.map((s: RequestStatus) => {
                  const isCurrent = r.status === s;
                  const meta = REQUEST_STATUS_META[s];
                  return (
                    <form action={updateRequestStatusAction} key={s}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value={s} />
                      <button
                        type="submit"
                        disabled={isCurrent}
                        className={`min-h-12 rounded-xl border-2 px-4 text-lg font-semibold ${
                          isCurrent
                            ? "border-blue-700 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 active:bg-slate-50"
                        }`}
                      >
                        {meta.emoji} {meta.label}
                      </button>
                    </form>
                  );
                })}
                <DeleteRequestButton id={r.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
