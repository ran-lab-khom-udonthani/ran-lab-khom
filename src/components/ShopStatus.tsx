"use client";

import { useEffect, useState } from "react";

type Now = { hh: string; mm: string; ss: string; minutes: number };

// เวลาปัจจุบันตามโซนเวลาไทย (Asia/Bangkok) — ไม่ขึ้นกับนาฬิกาเครื่องผู้ชม
function bangkokNow(): Now {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const hh = get("hour");
  const mm = get("minute");
  const ss = get("second");
  return { hh, mm, ss, minutes: parseInt(hh, 10) * 60 + parseInt(mm, 10) };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * ป้ายสถานะร้าน "เปิดอยู่ตอนนี้ / ปิดอยู่" + นาฬิกาเดินจริงทุกวินาที
 * ทำให้เว็บดูมีชีวิต (อัปเดตตลอด) — ใช้เวลาเปิด-ปิดจริงของร้าน
 * ค่าเริ่มต้น: เปิดทุกวัน 09:00–17:00
 */
export function ShopStatus({
  openHour = 9,
  closeHour = 17,
}: {
  openHour?: number;
  closeHour?: number;
}) {
  // เริ่มเป็น null เพื่อกัน hydration mismatch (เวลาเซิร์ฟเวอร์ ≠ เวลาเครื่องผู้ชม)
  const [now, setNow] = useState<Now | null>(null);

  useEffect(() => {
    setNow(bangkokNow());
    const id = setInterval(() => setNow(bangkokNow()), 1000);
    return () => clearInterval(id);
  }, []);

  const open = now
    ? now.minutes >= openHour * 60 && now.minutes < closeHour * 60
    : false;
  const hoursText = `เปิดทุกวัน ${pad2(openHour)}:00–${pad2(closeHour)}:00 น.`;

  return (
    <div className="mb-5 inline-flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-2 self-start rounded-full border bg-black/50 px-4 py-2 text-sm font-bold shadow-[0_0_36px_rgba(245,158,11,0.18)] ${
          open
            ? "border-[#06c755]/50 text-[#7ef0a6]"
            : "border-amber-300/40 text-amber-200"
        }`}
        suppressHydrationWarning
      >
        <span className="relative flex h-2.5 w-2.5">
          {open && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06c755] opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
              open ? "bg-[#06c755]" : now ? "bg-zinc-400" : "bg-[#06c755]"
            }`}
          />
        </span>
        {now ? (
          <>
            {open ? "เปิดอยู่ตอนนี้" : "ปิดอยู่ตอนนี้"}
            <span className="opacity-50">·</span>
            <span className="tabular-nums tracking-wide">
              {now.hh}:{now.mm}:{now.ss}
            </span>
          </>
        ) : (
          "ร้านลับคมอุดรธานี · เปิดจริง รับงานจริง"
        )}
      </span>
      <span
        className="self-start pl-1 text-xs font-semibold text-zinc-400"
        suppressHydrationWarning
      >
        {now && !open ? `${hoursText} · เปิดอีกที ${pad2(openHour)}:00 น.` : hoursText}
      </span>
    </div>
  );
}
