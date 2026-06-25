"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { REQUEST_CATEGORIES } from "@/lib/constants";
import { createRequestAction } from "@/app/actions";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 text-base font-black text-black transition hover:bg-amber-300 disabled:opacity-50"
    >
      {pending ? "กำลังส่ง..." : "ส่งคำขอลับคม"}
    </button>
  );
}

export function RequestForm() {
  const [state, formAction] = useActionState(createRequestAction, null);
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(cat: string) {
    setSelected((s) =>
      s.includes(cat) ? s.filter((c) => c !== cat) : [...s, cat]
    );
  }

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-amber-300/40 bg-black/50 p-8 text-center">
        <div className="text-4xl">✅</div>
        <h3 className="mt-3 text-2xl font-black text-amber-300">
          ส่งคำขอเรียบร้อยแล้ว!
        </h3>
        <p className="mt-2 leading-8 text-zinc-200">
          ทางร้านได้รับคำขอของคุณแล้ว เดี๋ยวช่างจะติดต่อกลับไปนะครับ
          <br />
          หากต้องการคุยด่วน แอดไลน์มาได้เลย
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* เลือกหมวด */}
      <div>
        <p className="mb-3 text-base font-bold text-amber-200">
          1. เลือกหมวดคมที่จะนำมาลับ (เลือกได้หลายหมวด)
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {REQUEST_CATEGORIES.map((cat) => {
            const on = selected.includes(cat);
            return (
              <button
                type="button"
                key={cat}
                onClick={() => toggle(cat)}
                aria-pressed={on}
                className={`min-h-12 rounded-xl border-2 px-3 text-sm font-bold transition ${
                  on
                    ? "border-amber-300 bg-amber-400 text-black"
                    : "border-white/15 bg-black/30 text-zinc-100 hover:border-amber-300/60"
                }`}
              >
                {on ? "✓ " : ""}
                {cat}
              </button>
            );
          })}
        </div>
        {/* ส่งค่าหมวดที่เลือกไปกับฟอร์ม */}
        {selected.map((c) => (
          <input key={c} type="hidden" name="category" value={c} />
        ))}
      </div>

      {/* ข้อมูลติดต่อ */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-amber-200">
            ชื่อ <span className="font-normal text-zinc-400">(ไม่บังคับ)</span>
          </label>
          <input
            name="customerName"
            autoComplete="name"
            placeholder="ชื่อของคุณ"
            className="min-h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-white placeholder:text-zinc-500 outline-none focus:border-amber-300"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-amber-200">
            เบอร์โทร <span className="text-amber-400">*</span>
          </label>
          <input
            name="customerPhone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="08X-XXX-XXXX"
            className="min-h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-white placeholder:text-zinc-500 outline-none focus:border-amber-300"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-amber-200">
          รายละเอียดเพิ่มเติม{" "}
          <span className="font-normal text-zinc-400">(ไม่บังคับ)</span>
        </label>
        <input
          name="note"
          placeholder="เช่น จำนวน, ยี่ห้อ, หรือสะดวกให้ติดต่อตอนไหน"
          className="min-h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-white placeholder:text-zinc-500 outline-none focus:border-amber-300"
        />
      </div>

      {state && !state.ok && state.error && (
        <p className="rounded-xl bg-red-500/15 px-4 py-3 text-base font-bold text-red-300">
          {state.error}
        </p>
      )}

      <SubmitButton disabled={selected.length === 0} />
      <p className="text-center text-sm text-zinc-400">
        ส่งคำขอแล้วช่างจะติดต่อกลับ — หรือแอดไลน์เพื่อสอบถามด่วน
      </p>
    </form>
  );
}
