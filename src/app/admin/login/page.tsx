"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "../actions";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "ร้านลับคมอุดรธานี";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "กำลังเข้า..." : "เข้าใช้งาน"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);
  const [show, setShow] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <div className="mb-2 text-5xl">🔐</div>
        <h1 className="text-3xl font-bold text-neutral-900">
          เข้าใช้งานพนักงาน
        </h1>
        <p className="mt-1 text-lg text-slate-500">{SHOP_NAME}</p>
      </div>

      <form
        action={formAction}
        className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label
          htmlFor="password"
          className="mb-2 block text-lg font-medium text-slate-700"
        >
          รหัสผ่าน
        </label>
        <input
          id="password"
          type={show ? "text" : "password"}
          name="password"
          autoFocus
          required
          className="mb-3 w-full min-h-14 rounded-xl border-2 border-slate-300 px-4 text-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="mb-4 min-h-12 rounded-lg px-3 text-lg font-medium text-blue-700 active:bg-blue-50"
        >
          {show ? "🙈 ซ่อนรหัส" : "👁️ แสดงรหัส"}
        </button>

        {state?.error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-xl font-medium text-red-700">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>

      <Link
        href="/"
        className="text-lg text-slate-400 underline-offset-4 active:text-slate-700"
      >
        ← กลับหน้าหลัก
      </Link>
    </main>
  );
}
