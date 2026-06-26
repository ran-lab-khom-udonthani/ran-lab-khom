"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { uploadGalleryPhotoAction } from "@/app/admin/actions";

async function loadBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // เบราว์เซอร์เก่าบางตัวไม่รองรับ option นี้
    return await createImageBitmap(file);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  q: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, q));
}

// ย่อ + หมุนตาม EXIF + แปลงเป็น webp; ถ้าเครื่องไม่รองรับ webp (เช่น iPhone บางรุ่น) ใช้ jpg แทน
async function shrinkImage(
  file: File,
  maxSize = 1280,
  quality = 0.82
): Promise<File> {
  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("เบราว์เซอร์ไม่รองรับการย่อรูป");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  let blob = await canvasToBlob(canvas, "image/webp", quality);
  let ext = "webp";
  let type = "image/webp";
  // iOS บางรุ่นจะคืน png/null แทน webp → ใช้ jpg แทน
  if (!blob || blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
    ext = "jpg";
    type = "image/jpeg";
  }
  if (!blob) throw new Error("แปลงรูปไม่สำเร็จ (เบราว์เซอร์ไม่รองรับ)");
  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${base}.${ext}`, { type });
}

export function GalleryUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onUpload() {
    if (files.length === 0) {
      setMsg({ ok: false, text: "เลือกรูปก่อนนะครับ" });
      return;
    }
    setBusy(true);
    setMsg(null);
    setDone(0);
    let success = 0;
    let fail = 0;
    let firstErr = "";
    for (const f of files) {
      try {
        const img = await shrinkImage(f);
        const fd = new FormData();
        fd.append("file", img);
        fd.append("category", category);
        const res = await uploadGalleryPhotoAction(fd);
        if (res?.ok) {
          success++;
        } else {
          fail++;
          if (!firstErr) firstErr = res?.error || "อัปไม่สำเร็จ";
        }
      } catch (e) {
        fail++;
        if (!firstErr) firstErr = e instanceof Error ? e.message : "อัปไม่สำเร็จ";
      }
      setDone((d) => d + 1);
    }
    setBusy(false);
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
    setMsg({
      ok: fail === 0,
      text:
        fail === 0
          ? `อัปขึ้นแล้ว ${success} รูป 🎉`
          : `สำเร็จ ${success} รูป · ล้มเหลว ${fail} รูป${
              firstErr ? ` — ${firstErr}` : ""
            }`,
    });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
      <h2 className="text-2xl font-bold text-slate-900">เพิ่มรูปงาน</h2>
      <p className="mt-1 text-base text-slate-500">
        เลือกหมวด → เลือกรูปจากเครื่อง (เลือกหลายรูปได้) → กดอัป
      </p>

      <label className="mt-4 block text-lg font-semibold text-slate-700">
        1. หมวดของรูป
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={busy}
        className="mt-1 min-h-14 w-full rounded-xl border-2 border-slate-300 bg-white px-4 text-lg text-slate-900"
      >
        {GALLERY_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="AUTO">🤖 AI แยกหมวดอัตโนมัติ (ต้องตั้งค่าคีย์ก่อน)</option>
      </select>
      {category === "AUTO" && (
        <p className="mt-1 text-sm text-amber-700">
          ต้องตั้งค่า ANTHROPIC_API_KEY ก่อนถึงจะใช้ได้ — ถ้ายังไม่มี เลือกหมวดเองด้านบนแทน
        </p>
      )}

      <label className="mt-4 block text-lg font-semibold text-slate-700">
        2. เลือกรูป
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        className="mt-1 block w-full rounded-xl border-2 border-dashed border-slate-300 p-3 text-base file:mr-3 file:min-h-12 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:text-base file:font-bold file:text-white"
      />
      {files.length > 0 && (
        <p className="mt-2 text-base font-semibold text-slate-700">
          เลือกไว้ {files.length} รูป
        </p>
      )}

      <button
        type="button"
        onClick={onUpload}
        disabled={busy || files.length === 0}
        className="btn-primary mt-4"
      >
        {busy
          ? `กำลังอัป ${done}/${files.length}...`
          : `อัปโหลด ${files.length || ""} รูป`}
      </button>

      {msg && (
        <p
          className={`mt-3 rounded-xl px-4 py-3 text-lg font-bold ${
            msg.ok
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
