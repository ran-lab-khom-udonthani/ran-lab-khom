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
        className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-lg uppercase tracking-wider outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
      >
        เช็ค
      </button>
    </form>
  );
}
