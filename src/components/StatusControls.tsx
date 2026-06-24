import { STATUS_META, type JobStatus } from "@/lib/constants";
import { updateStatusAction } from "@/app/admin/actions";

// ขั้นตอนถัดไปแบบปกติ (happy path)
const NEXT: Record<string, { to: JobStatus; label: string } | null> = {
  PENDING: { to: "IN_PROGRESS", label: "▶ เริ่มทำ" },
  IN_PROGRESS: { to: "DONE", label: "✔ ทำเสร็จแล้ว" },
  DONE: { to: "PICKED_UP", label: "📦 ลูกค้ารับแล้ว" },
  PICKED_UP: null,
  CANCELLED: null,
};

// ปุ่มใหญ่ปุ่มเดียว — เลื่อนไปสถานะถัดไป (วางในแถบล่าง)
export function AdvanceStatus({
  jobId,
  current,
}: {
  jobId: string;
  current: string;
}) {
  const next = NEXT[current];
  if (!next) {
    return (
      <p className="py-2 text-center text-xl font-medium text-slate-500">
        {current === "CANCELLED" ? "งานนี้ถูกยกเลิก" : "งานนี้เสร็จสมบูรณ์ ✓"}
      </p>
    );
  }
  return (
    <form action={updateStatusAction}>
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="status" value={next.to} />
      <button
        type="submit"
        className="flex w-full min-h-16 items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 text-2xl font-bold text-white active:bg-green-700"
      >
        {next.label}
      </button>
    </form>
  );
}

// รายการเปลี่ยนสถานะแบบละเอียด (รอง — อยู่ใน accordion)
export function StatusControls({
  jobId,
  current,
}: {
  jobId: string;
  current: string;
}) {
  const main: JobStatus[] = ["PENDING", "IN_PROGRESS", "DONE", "PICKED_UP"];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {main.map((s) => {
          const meta = STATUS_META[s];
          const isCurrent = current === s;
          return (
            <form action={updateStatusAction} key={s}>
              <input type="hidden" name="jobId" value={jobId} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                disabled={isCurrent}
                className={`flex w-full min-h-14 items-center justify-center gap-1.5 rounded-xl border-2 px-3 text-lg font-semibold ${
                  isCurrent
                    ? "border-blue-700 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 active:bg-slate-50"
                }`}
              >
                <span aria-hidden>{meta.emoji}</span> {meta.label}
              </button>
            </form>
          );
        })}
      </div>

      {/* ยกเลิกงาน — แยกออกมา ปุ่มกว้างขอบแดง */}
      <form action={updateStatusAction}>
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="status" value="CANCELLED" />
        <button
          type="submit"
          disabled={current === "CANCELLED"}
          className="flex w-full min-h-14 items-center justify-center gap-1.5 rounded-xl border-2 border-red-300 bg-white px-3 text-lg font-semibold text-red-700 active:bg-red-50 disabled:opacity-50"
        >
          ❌ ยกเลิกงานนี้
        </button>
      </form>
    </div>
  );
}
