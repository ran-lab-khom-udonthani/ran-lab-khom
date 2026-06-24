import { STATUS_META, isValidStatus } from "@/lib/constants";

export function StatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md" | "lg";
}) {
  const meta = isValidStatus(status) ? STATUS_META[status] : null;
  const sizeCls =
    size === "lg"
      ? "text-xl px-4 py-2 th-nowrap"
      : size === "sm"
        ? "text-base px-3 py-1"
        : "text-lg px-3 py-1.5";

  const base =
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-bold";

  if (!meta) {
    return (
      <span
        className={`${base} bg-slate-200 text-slate-800 ring-1 ring-slate-400 ${sizeCls}`}
      >
        {status}
      </span>
    );
  }

  return (
    <span className={`${base} ${meta.badge} ${sizeCls}`}>
      <span aria-hidden>{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
