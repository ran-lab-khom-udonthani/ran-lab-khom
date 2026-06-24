import { formatBaht, formatThaiDate } from "@/lib/utils";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านลับคมอุดรธานี";

type ReceiptItem = {
  id: string;
  kind: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
};

type ReceiptJob = {
  code: string;
  customerName: string;
  customerPhone: string | null;
  note: string | null;
  totalPrice: number;
  paid: boolean;
  receivedAt: Date;
  readyBy: Date | null;
  items: ReceiptItem[];
};

export function Receipt({
  job,
  trackUrl,
}: {
  job: ReceiptJob;
  trackUrl: string;
}) {
  return (
    <div className="mx-auto max-w-md bg-white p-6 text-slate-900">
      {/* หัวใบ */}
      <div className="border-b-2 border-dashed border-slate-300 pb-3 text-center">
        <div className="text-2xl font-bold">{SHOP_NAME}</div>
        <div className="text-sm text-slate-500">
          ลับคม กรรไกร · ปัตตาเลี่ยน · มีดแร่ปลา
        </div>
        <div className="mt-2 text-lg font-semibold">ใบรับงาน</div>
      </div>

      {/* รหัส + วันที่ */}
      <div className="flex items-center justify-between py-3">
        <div>
          <div className="text-xs text-slate-500">รหัสงาน</div>
          <div className="font-mono text-2xl font-bold tracking-wider">
            {job.code}
          </div>
        </div>
        <div className="text-right text-sm">
          <div>
            <span className="text-slate-500">รับงาน:</span>{" "}
            {formatThaiDate(job.receivedAt)}
          </div>
          {job.readyBy && (
            <div>
              <span className="text-slate-500">นัดรับ:</span>{" "}
              {formatThaiDate(job.readyBy)}
            </div>
          )}
        </div>
      </div>

      {/* ลูกค้า */}
      <div className="border-t border-slate-200 py-2 text-sm">
        <span className="text-slate-500">ลูกค้า:</span> {job.customerName}
        {job.customerPhone && (
          <span className="ml-2 text-slate-500">({job.customerPhone})</span>
        )}
      </div>

      {/* รายการคม */}
      <table className="w-full border-t border-slate-200 text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-2">รายการ</th>
            <th className="py-2 text-center">จำนวน</th>
            <th className="py-2 text-right">ราคา</th>
          </tr>
        </thead>
        <tbody>
          {job.items.map((it) => (
            <tr key={it.id} className="border-t border-slate-100 align-top">
              <td className="py-1.5">
                {it.kind}
                {it.description && (
                  <span className="block text-xs text-slate-400">
                    {it.description}
                  </span>
                )}
              </td>
              <td className="py-1.5 text-center">{it.quantity}</td>
              <td className="py-1.5 text-right">
                {formatBaht(it.quantity * it.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* รวม */}
      <div className="flex items-center justify-between border-t-2 border-slate-300 py-3">
        <span className="font-semibold">รวมทั้งหมด</span>
        <span className="text-xl font-bold">{formatBaht(job.totalPrice)}</span>
      </div>
      <div className="pb-3 text-right text-sm">
        สถานะชำระเงิน:{" "}
        {job.paid ? (
          <span className="font-semibold text-green-600">ชำระแล้ว</span>
        ) : (
          <span className="font-semibold text-orange-600">ยังไม่ชำระ</span>
        )}
      </div>

      {job.note && (
        <div className="border-t border-slate-200 py-2 text-sm text-slate-600">
          📝 {job.note}
        </div>
      )}

      {/* QR สแกนเช็คสถานะ */}
      <div className="mt-2 flex flex-col items-center border-t-2 border-dashed border-slate-300 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/qr?data=${encodeURIComponent(trackUrl)}`}
          alt="QR เช็คสถานะงาน"
          width={160}
          height={160}
        />
        <div className="mt-2 text-center text-sm font-medium">
          📱 สแกนเพื่อเช็คสถานะงาน
        </div>
        <div className="mt-1 break-all text-center text-xs text-slate-400">
          {trackUrl}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-slate-400">
        ขอบคุณที่ใช้บริการ 🙏
      </div>
    </div>
  );
}
