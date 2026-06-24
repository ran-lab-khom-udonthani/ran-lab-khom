"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabBar() {
  const pathname = usePathname();
  const isNew = pathname.startsWith("/admin/jobs/new");
  const isQueue = !isNew;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto grid max-w-md grid-cols-2 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] no-print">
      <Link
        href="/admin"
        aria-current={isQueue ? "page" : undefined}
        className={`flex min-h-[72px] flex-col items-center justify-center gap-1 text-[15px] font-semibold ${
          isQueue ? "text-blue-700" : "text-slate-500"
        }`}
      >
        <span className="text-3xl leading-none" aria-hidden>
          📋
        </span>
        <span>คิวงาน</span>
      </Link>
      <Link
        href="/admin/jobs/new"
        aria-current={isNew ? "page" : undefined}
        className={`flex min-h-[72px] flex-col items-center justify-center gap-1 text-[15px] font-semibold ${
          isNew ? "text-blue-700" : "text-slate-500"
        }`}
      >
        <span className="text-4xl leading-none text-blue-600" aria-hidden>
          ➕
        </span>
        <span>รับงานใหม่</span>
      </Link>
    </nav>
  );
}
