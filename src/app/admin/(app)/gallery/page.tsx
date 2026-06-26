import { prisma } from "@/lib/prisma";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GalleryUploader } from "@/components/GalleryUploader";
import { deleteGalleryPhotoAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type Photo = {
  id: string;
  url: string;
  category: string;
  caption: string | null;
};

export default async function AdminGalleryPage() {
  let photos: Photo[] = [];
  try {
    photos = await prisma.galleryPhoto.findMany({
      orderBy: [{ category: "asc" }, { createdAt: "desc" }],
      select: { id: true, url: true, category: true, caption: true },
    });
  } catch {
    photos = [];
  }

  const countByCat = (cat: string) =>
    photos.filter((p) => p.category === cat).length;

  return (
    <div className="space-y-5">
      <GalleryUploader />

      <section className="rounded-2xl border-2 border-slate-200 bg-white p-4">
        <h2 className="text-2xl font-bold text-slate-900">
          รูปที่อัปแล้ว ({photos.length})
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {GALLERY_CATEGORIES.map((c) => (
            <span
              key={c}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600"
            >
              {c}: {countByCat(c)}
            </span>
          ))}
        </div>

        {photos.length === 0 ? (
          <p className="mt-4 text-base text-slate-500">
            ยังไม่มีรูปที่อัปจากหลังร้าน (รูปชุดเดิม 80 รูปยังแสดงบนเว็บตามปกติ)
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-xl border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.caption ?? p.category}
                  className="h-32 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-2">
                  <p className="truncate text-xs font-semibold text-slate-500">
                    {p.category}
                  </p>
                  <form action={deleteGalleryPhotoAction} className="mt-1">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="min-h-10 w-full rounded-lg bg-red-50 text-base font-bold text-red-700 active:bg-red-100"
                    >
                      ลบรูปนี้
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
