"use client";

export function PrintButton({
  children = "🖨️ พิมพ์ใบรับงาน",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}
