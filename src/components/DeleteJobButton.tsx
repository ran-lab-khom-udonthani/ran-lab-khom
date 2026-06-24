"use client";

import { deleteJobAction } from "@/app/admin/actions";

export function DeleteJobButton({ jobId }: { jobId: string }) {
  return (
    <form
      action={deleteJobAction}
      onSubmit={(e) => {
        if (!confirm("ลบงานนี้ถาวร? กู้คืนไม่ได้")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="jobId" value={jobId} />
      <button type="submit" className="btn-danger w-full">
        🗑️ ลบทิ้ง
      </button>
    </form>
  );
}
