"use client";

import { useEffect } from "react";

/**
 * กันเบราว์เซอร์ในแอป (Messenger / LINE / FB) จำตำแหน่งสกอลล์เดิมตอนเปิดลิงก์ซ้ำ
 * แล้วเด้งลงไปกลางหน้า — บังคับให้เริ่มที่บนสุดเสมอ
 * ยกเว้นกรณีมี #hash (เช่น กดลิงก์ "ส่งคำขอออนไลน์ ↓" → #request) ให้ทำงานตามปกติ
 */
export function ResetScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  return null;
}
