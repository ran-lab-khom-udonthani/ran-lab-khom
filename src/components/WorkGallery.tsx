"use client";

import { useCallback, useEffect, useState } from "react";

type WorkItem = { title: string; image: string };
type WorkGroup = { category: string; description: string; items: WorkItem[] };

// จำนวนรูปที่โชว์ต่อหมวดก่อนกด "ดูเพิ่ม"
const INITIAL_PER_GROUP = 8;

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
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

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
        {groups.map((group, groupIndex) => {
          const isExpanded = expanded.has(groupIndex);
          const visible = isExpanded
            ? group.items
            : group.items.slice(0, INITIAL_PER_GROUP);
          return (
          <section
            aria-labelledby={`work-group-${groupIndex}`}
            className="border-t border-white/10 pt-8"
            key={group.category}
          >
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                  {group.items.length} รูปงานจริง
                </p>
                <h3
                  className="mt-1 text-2xl font-extrabold leading-tight text-white md:text-3xl"
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
              {visible.map((item, itemIndex) => {
                const idx = offsets[groupIndex] + itemIndex;
                return (
                  <button
                    type="button"
                    onClick={() => setOpen(idx)}
                    className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-left transition hover:-translate-y-1 hover:border-amber-300/70"
                    key={`${group.category}-${itemIndex}`}
                  >
                    <span className="relative block">
                      <img
                        alt={`${item.title} · ${group.category} · ลับคมอุดรธานี By ช่างเจี๊ยบ`}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64 lg:h-72"
                        decoding="async"
                        loading="lazy"
                        src={item.image}
                      />
                      {/* ป้ายมุมรูปแบบถาวร — บอกผู้ใช้มือถือว่าแตะดูได้ (hover ใช้ไม่ได้บนจอสัมผัส) */}
                      <span className="pointer-events-none absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-amber-300 ring-1 ring-white/15">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      </span>
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                        <span className="rounded-full bg-amber-400 px-4 py-2 text-sm font-extrabold text-black shadow-lg">
                          แตะดูรูปเต็ม
                        </span>
                      </span>
                    </span>
                    <span className="block border-t border-white/10 px-4 py-3">
                      <span className="block text-sm font-bold text-amber-300">
                        {group.category}
                      </span>
                      <span className="mt-1 block text-base font-extrabold leading-7 text-white">
                        {item.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {!isExpanded && group.items.length > INITIAL_PER_GROUP && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((s) => new Set(s).add(groupIndex))
                  }
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-300/60 bg-black/30 px-6 text-base font-extrabold text-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-300 hover:text-black"
                >
                  ดูเพิ่มในหมวดนี้ ({group.items.length - INITIAL_PER_GROUP} รูป)
                </button>
              </div>
            )}
          </section>
          );
        })}
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
            className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-black/50 ring-1 ring-white/15 text-2xl font-bold text-white transition hover:bg-white/20 md:right-6 md:top-6"
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
            className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 ring-1 ring-white/15 text-3xl text-white transition hover:bg-white/20 md:left-6"
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
            className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 ring-1 ring-white/15 text-3xl text-white transition hover:bg-white/20 md:right-6"
          >
            ›
          </button>

          <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={`${current.title} - ${current.category}`}
              className="mx-auto max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center">
              <p className="text-sm font-bold text-amber-300">
                {current.category}
              </p>
              <p className="text-lg font-extrabold text-white">{current.title}</p>
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
