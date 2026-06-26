"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { uploadGalleryPhotoAction } from "@/app/admin/actions";

// ย่อ + หมุนตาม EXIF + แปลงเป็น webp ในเครื่อง (ลดขนาดก่อนอัป)
async function toWebp(file: File, maxSize = 1280, quality = 0.82): Promise<File> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas ไม่พร้อม");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("แปลงรูปไม่สำเร็จ"))),
      "image/webp",
      quality
    )
  );
  const base = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.webp`, { type: "image/webp" });
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
    for (const f of files) {
      try {
        const webp = await toWebp(f);
        const fd = new FormData();
        fd.append("file", webp);
        fd.append("category", category);
        await uploadGalleryPhotoAction(fd);
        success++;
      } catch {
        fail++;
      }
      setDone((d) => d + 1);
    }
    setBusy(false);
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
    setMsg({
      ok: fail === 0,
      text:
        `อัปขึ้นแล้ว ${success} รูป` + (fail ? ` · ล้มเหลว ${fail} รูป` : " 🎉"),
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
      </select>

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
