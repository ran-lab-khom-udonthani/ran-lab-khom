"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabBar({ requestCount = 0 }: { requestCount?: number }) {
  const pathname = usePathname();
  const isNew = pathname.startsWith("/admin/jobs/new");
  const isRequests = pathname.startsWith("/admin/requests");
  const isQueue = !isNew && !isRequests;

  const item = (active: boolean) =>
    `relative flex min-h-[72px] flex-col items-center justify-center gap-1 text-[15px] font-semibold ${
      active ? "text-blue-700" : "text-slate-500"
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto grid max-w-md grid-cols-3 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] no-print">
      <Link
        href="/admin"
        aria-current={isQueue ? "page" : undefined}
        className={item(isQueue)}
      >
        <span className="text-3xl leading-none" aria-hidden>
          📋
        </span>
        <span>คิวงาน</span>
      </Link>
      <Link
        href="/admin/jobs/new"
        aria-current={isNew ? "page" : undefined}
        className={item(isNew)}
      >
        <span className="text-3xl leading-none text-blue-600" aria-hidden>
          ➕
        </span>
        <span>รับงานใหม่</span>
      </Link>
      <Link
        href="/admin/requests"
        aria-current={isRequests ? "page" : undefined}
        className={item(isRequests)}
      >
        <span className="relative text-3xl leading-none" aria-hidden>
          📥
          {requestCount > 0 && (
            <span className="absolute -right-3 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-xs font-bold leading-5 text-white">
              {requestCount > 99 ? "99+" : requestCount}
            </span>
          )}
        </span>
        <span>คำขอ{requestCount > 0 ? ` (${requestCount})` : ""}</span>
      </Link>
    </nav>
  );
}
