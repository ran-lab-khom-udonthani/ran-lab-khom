"use client";

import { deleteRequestAction } from "@/app/admin/actions";

export function DeleteRequestButton({ id }: { id: string }) {
  return (
    <form
      action={deleteRequestAction}
      onSubmit={(e) => {
        if (!confirm("ลบคำขอนี้ถาวร?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="min-h-12 rounded-xl border-2 border-red-300 bg-white px-4 text-lg font-semibold text-red-700 active:bg-red-50"
      >
        🗑️ ลบ
      </button>
    </form>
  );
}
