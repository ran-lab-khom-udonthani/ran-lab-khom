import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "../actions";
import { TabBar } from "@/components/TabBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const requestCount = await prisma.jobRequest.count({
    where: { status: "NEW" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 mx-auto flex min-h-14 max-w-md items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur no-print">
        <span className="flex items-center gap-2 text-xl font-bold">
          🔪 ลับคม
        </span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="min-h-12 rounded-lg px-3 text-lg font-medium text-slate-500 active:bg-red-50 active:text-red-600"
          >
            ออก
          </button>
        </form>
      </header>

      <main className="mx-auto max-w-md px-4 pt-4 pb-28 text-xl leading-relaxed text-neutral-900">
        {children}
      </main>

      <TabBar requestCount={requestCount} />
    </div>
  );
}
