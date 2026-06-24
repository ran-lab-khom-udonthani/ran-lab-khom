import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/baseUrl";
import { Receipt } from "@/components/Receipt";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function PrintReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
  if (!job) notFound();

  const trackUrl = `${await getBaseUrl()}/track/${job.code}`;

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Link
          href={`/admin/jobs/${job.id}`}
          className="text-sm text-slate-400 underline-offset-4 hover:text-slate-700 hover:underline"
        >
          ← กลับ
        </Link>
        <PrintButton className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-700" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Receipt job={job} trackUrl={trackUrl} />
      </div>
    </div>
  );
}
