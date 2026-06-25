"use client";

import { useCallback, useEffect, useState } from "react";

type WorkItem = { title: string; image: string };
type WorkGroup = { category: string; description: string; items: WorkItem[] };

export function WorkGallery({ groups }: { groups: WorkGroup[] }) {
  // แผ่รูปทั้งหมดเป็นลำดับเดียว เพื่อให้เลื่อนซ้าย-ขวาใน lightbox ได้ต่อเนื่อง
  const flat = groups.flatMap((g) =>
    g.items.map((it) => ({
      image: it.image,
      title: it.title,
      category: g.category,
    }))
  );

  // index เริ่มต้นของแต่ละกลุ่ม (ไว้คำนวณ index รวมของรูป)
  const offsets: number[] = [];
  let acc = 0;
  for (const g of groups) {
    offsets.push(acc);
    acc += g.items.length;
  }

  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () =>
      setOpen((i) => (i === null ? i : (i - 1 + flat.length) % flat.length)),
    [flat.length]
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % flat.length)),
    [flat.length]
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  const current = open !== null ? flat[open] : null;

  return (
    <>
      <div className="space-y-12">
        {groups.map((group, groupIndex) => (
          <section
            aria-labelledby={`work-group-${groupIndex}`}
            className="border-t border-white/10 pt-8"
            key={group.category}
          >
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                  {group.items.length} Real Photos
                </p>
                <h3
                  className="mt-1 text-2xl font-black leading-tight text-white md:text-3xl"
                  id={`work-group-${groupIndex}`}
                >
                  {group.category}
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-7 text-zinc-300 md:text-right">
                {group.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((item, itemIndex) => {
                const idx = offsets[groupIndex] + itemIndex;
                return (
                  <button
                    type="button"
                    onClick={() => setOpen(idx)}
                    className="group block overflow-hidden rounded-lg border border-white/10 bg-zinc-950 text-left transition hover:-translate-y-1 hover:border-amber-300/70"
                    key={`${group.category}-${item.title}`}
                  >
                    <span className="relative block">
                      <img
                        alt={`${item.title} - ${group.category}`}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                        decoding="async"
                        loading="lazy"
                        src={item.image}
                      />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                        <span className="rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-black shadow-lg">
                          ดูรูปเต็ม
                        </span>
                      </span>
                    </span>
                    <span className="block border-t border-white/10 px-4 py-3">
                      <span className="block text-sm font-bold text-amber-300">
                        {group.category}
                      </span>
                      <span className="mt-1 block text-base font-black leading-7 text-white">
                        {item.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="ปิด"
            className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl font-bold text-white transition hover:bg-white/20 md:right-6 md:top-6"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="รูปก่อนหน้า"
            className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 md:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="รูปถัดไป"
            className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 md:right-6"
          >
            ›
          </button>

          <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={`${current.title} - ${current.category}`}
              className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center">
              <p className="text-sm font-bold text-amber-300">
                {current.category}
              </p>
              <p className="text-lg font-black text-white">{current.title}</p>
              <p className="mt-1 text-sm text-zinc-400">
                {(open ?? 0) + 1} / {flat.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
