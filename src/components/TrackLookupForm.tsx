"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TrackLookupForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (c) router.push(`/track/${encodeURIComponent(c)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="เช่น KH-7F3A"
        className="min-h-12 flex-1 rounded-xl border border-white/15 bg-black/40 px-4 text-lg uppercase tracking-wider text-white outline-none placeholder:text-zinc-500 focus:border-amber-300"
      />
      <button
        type="submit"
        className="min-h-12 rounded-xl bg-amber-400 px-6 font-extrabold text-black transition hover:bg-amber-300"
      >
        เช็กสถานะ
      </button>
    </form>
  );
}
