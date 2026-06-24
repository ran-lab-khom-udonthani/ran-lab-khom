"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ITEM_PRESETS, presetToRow, type ItemPreset } from "@/lib/constants";
import { formatBaht } from "@/lib/utils";
import { createJobAction } from "@/app/admin/actions";

type Row = {
  key: number;
  kind: string;
  description: string;
  quantity: number;
  unitPrice: number;
  descOpen: boolean;
};

let nextKey = 1;

function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function dateFromToday(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return localISO(d);
}

function SubmitBar({ canSave, total }: { canSave: boolean; total: number }) {
  const { pending } = useFormStatus();
  return (
    <div className="fixed inset-x-0 bottom-[72px] z-30 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-4 pt-3 pb-3 backdrop-blur no-print">
      <button type="submit" disabled={pending || !canSave} className="btn-primary">
        {pending ? "กำลังบันทึก..." : `บันทึกงาน · ${formatBaht(total)}`}
      </button>
    </div>
  );
}

export function JobForm() {
  const [rows, setRows] = useState<Row[]>([]);
  const [readyBy, setReadyBy] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusKey, setFocusKey] = useState<number | null>(null);
  const containerRef = useRef<HTMLFormElement>(null);

  const total = rows.reduce(
    (sum, r) => sum + (r.quantity || 0) * (r.unitPrice || 0),
    0
  );

  // โฟกัสช่องราคาของแถวที่เพิ่งเพิ่ม (กรณี "อื่นๆ")
  useEffect(() => {
    if (focusKey == null || !containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLInputElement>(
      `input[name="itemPrice"][data-rowkey="${focusKey}"]`
    );
    el?.focus();
    setFocusKey(null);
  }, [focusKey, rows]);

  function update(key: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }
  function removeRow(key: number) {
    setRows((rs) => rs.filter((r) => r.key !== key));
  }

  function addPreset(p: ItemPreset) {
    if (p.value === "อื่นๆ") {
      const key = nextKey++;
      setRows((rs) => [...rs, { key, descOpen: true, ...presetToRow(p) }]);
      setFocusKey(key);
      return;
    }
    // ประเภทเดิมที่มีอยู่แล้ว → เพิ่มจำนวนแทนการสร้างแถวซ้ำ
    // ใช้ functional updater อ่าน state ล่าสุดเสมอ (กันแตะรัวสร้างแถวซ้ำ)
    setRows((rs) => {
      const existing = rs.find((r) => r.kind === p.value);
      if (existing) {
        return rs.map((r) =>
          r.key === existing.key ? { ...r, quantity: r.quantity + 1 } : r
        );
      }
      return [...rs, { key: nextKey++, descOpen: false, ...presetToRow(p) }];
    });
  }

  function stepQty(r: Row, delta: number) {
    const next = r.quantity + delta;
    if (next < 1) removeRow(r.key);
    else update(r.key, { quantity: next });
  }

  const chipBase =
    "min-h-14 rounded-full px-4 text-lg font-semibold active:scale-95";

  return (
    <form action={createJobAction} ref={containerRef} className="space-y-5">
      {/* ชื่อลูกค้า (ไม่บังคับ) */}
      <div>
        <label
          htmlFor="customerName"
          className="mb-1 block text-lg font-medium text-slate-700"
        >
          ชื่อลูกค้า{" "}
          <span className="font-normal text-slate-400">(ไม่บังคับ)</span>
        </label>
        <input
          id="customerName"
          name="customerName"
          autoComplete="name"
          autoFocus
          placeholder="เช่น ป้าสมศรี"
          className="w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
        />
      </div>

      {/* ปุ่มลัดประเภทคม */}
      <div>
        <p className="mb-2 text-xl font-semibold text-neutral-900">
          เลือกของที่จะลับ — แตะเพื่อเพิ่ม
        </p>
        <div className="grid grid-cols-2 gap-3">
          {ITEM_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => addPreset(p)}
              className="min-h-16 rounded-2xl border-2 border-slate-300 bg-white px-4 text-xl font-semibold text-neutral-900 active:bg-blue-50"
            >
              {p.label}
              {p.defaultPrice > 0 && (
                <span className="ml-1 font-normal text-slate-400">
                  · {p.defaultPrice}฿
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* รายการในงานนี้ */}
      {rows.length > 0 && (
        <div>
          <p className="mb-2 text-xl font-semibold text-neutral-900">
            รายการในงานนี้
          </p>
          <div className="space-y-3">
            {rows.map((r) => (
              <div
                key={r.key}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                {/* ชื่อประเภท + แก้รายละเอียด */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-semibold text-neutral-900">
                    {r.kind}
                  </span>
                  <button
                    type="button"
                    onClick={() => update(r.key, { descOpen: !r.descOpen })}
                    className="min-h-12 rounded-lg px-3 text-lg text-blue-700 active:bg-blue-50"
                  >
                    ✎ รายละเอียด
                  </button>
                </div>

                {/* ฟิลด์แฝง — ส่งค่าตรงลำดับเสมอ */}
                <input type="hidden" name="itemKind" value={r.kind} />
                <input type="hidden" name="itemQty" value={r.quantity} />
                <input type="hidden" name="itemDesc" value={r.description} />

                {r.descOpen && (
                  <input
                    value={r.description}
                    onChange={(e) =>
                      update(r.key, { description: e.target.value })
                    }
                    placeholder="ยี่ห้อ/รุ่น เช่น Wahl"
                    className="mt-2 w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-lg outline-none focus:border-blue-600"
                  />
                )}

                {/* จำนวน */}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="ลดจำนวน"
                    onClick={() => stepQty(r, -1)}
                    className="flex size-14 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-3xl font-bold text-slate-700 active:bg-slate-100"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-2xl font-bold tabular-nums">
                    {r.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="เพิ่มจำนวน"
                    onClick={() => stepQty(r, 1)}
                    className="flex size-14 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-3xl font-bold text-slate-700 active:bg-slate-100"
                  >
                    +
                  </button>
                  <span className="text-lg text-slate-400">ชิ้น</span>
                </div>

                {/* ราคาต่อชิ้น */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-lg text-slate-500">ราคา/ชิ้น</span>
                  <div className="flex items-center gap-1">
                    <input
                      name="itemPrice"
                      data-rowkey={r.key}
                      inputMode="numeric"
                      value={r.unitPrice}
                      onChange={(e) =>
                        update(r.key, {
                          unitPrice: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-28 min-h-14 rounded-xl border-2 border-slate-300 px-3 text-right text-xl outline-none focus:border-blue-600"
                    />
                    <span className="text-lg text-slate-400">฿</span>
                  </div>
                </div>

                <p className="mt-2 text-right text-lg tabular-nums text-slate-500">
                  รวม {formatBaht((r.quantity || 0) * (r.unitPrice || 0))}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* เพิ่มเติม (ไม่บังคับ) */}
      <details className="rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-xl font-semibold text-neutral-900">
          เพิ่มเติม (ไม่บังคับ)
        </summary>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="customerPhone"
              className="mb-1 block text-lg font-medium text-slate-700"
            >
              เบอร์โทร
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="08X-XXX-XXXX"
              className="w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="note"
              className="mb-1 block text-lg font-medium text-slate-700"
            >
              หมายเหตุ
            </label>
            <input
              id="note"
              name="note"
              placeholder="เช่น ลับด่วน, ระวังคมบิ่น"
              className="w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <p className="mb-2 text-lg font-medium text-slate-700">วันนัดรับ</p>
            <input type="hidden" name="readyBy" value={readyBy} />
            <div className="flex flex-wrap gap-2">
              {[
                { label: "วันนี้", val: dateFromToday(0) },
                { label: "พรุ่งนี้", val: dateFromToday(1) },
                { label: "+3 วัน", val: dateFromToday(3) },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    setReadyBy(c.val);
                    setShowDatePicker(false);
                  }}
                  className={`${chipBase} border-2 ${
                    readyBy === c.val && !showDatePicker
                      ? "border-blue-700 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowDatePicker((v) => !v)}
                className={`${chipBase} border-2 ${
                  showDatePicker
                    ? "border-blue-700 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                เลือกวันที่
              </button>
            </div>
            {showDatePicker && (
              <input
                type="date"
                value={readyBy}
                onChange={(e) => setReadyBy(e.target.value)}
                className="mt-2 w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600"
              />
            )}
          </div>
        </div>
      </details>

      {/* เว้นที่ให้แถบบันทึก + เมนูล่าง */}
      <div className="h-36" aria-hidden />

      <SubmitBar canSave={rows.length > 0} total={total} />
    </form>
  );
}
