"use client";

import { useEffect } from "react";

/**
 * กันหน้าเว็บเปิดมาแล้วเด้ง/ไหลลงไปกลางหน้า (แกลเลอรี) ในเบราว์เซอร์ในแอป
 * (Messenger / LINE / Facebook = WKWebView บน iOS) ซึ่งจะเรียกคืนตำแหน่งสกอลล์เดิม
 * แบบ asynchronous หลังหน้าโหลดเสร็จ (50–600ms) ทับค่าที่เราตั้งไว้
 *
 * วิธีแก้: ตรึงหน้าให้อยู่บนสุด "ทุกเฟรม" ด้วย behavior:'auto' (กระโดด ไม่ไหล)
 * จนกว่าผู้ใช้จะแตะ/เลื่อนเอง หรือพ้นช่วงโหลด (800ms) แล้วค่อยเปิด smooth-scroll
 * ให้คลิกเมนูเลื่อนนุ่ม — ถ้าลิงก์มี #section (ตั้งใจชี้) ปล่อยให้เลื่อนตามปกติ
 */
export function ResetScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const enableSmooth = () => html.classList.add("smooth-scroll");

    // ลิงก์มี #hash = ตั้งใจชี้ไปที่ section นั้น (เช่น #request) → ปล่อยให้เลื่อนปกติ
    if (window.location.hash) {
      const t = window.setTimeout(enableSmooth, 700);
      return () => clearTimeout(t);
    }

    let userActed = false;
    let rafId = 0;
    const snapTop = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const hold = () => {
      if (userActed) return;
      snapTop();
      rafId = requestAnimationFrame(hold);
    };

    const stopHold = () => {
      cancelAnimationFrame(rafId);
      enableSmooth(); // พ้นช่วง reset → เปิด smooth ให้คลิกเมนูเลื่อนนุ่ม
    };

    const onUser = () => {
      if (userActed) return;
      userActed = true;
      stopHold();
    };

    // หยุดตรึงทันทีเมื่อผู้ใช้แตะ/เลื่อน/กดเมนู (กันยกหน้าจอตอนกำลังใช้งาน)
    const evts = [
      "wheel",
      "touchstart",
      "touchmove",
      "pointerdown",
      "keydown",
      "hashchange",
    ];
    evts.forEach((e) => window.addEventListener(e, onUser, { passive: true }));

    // เปิดลิงก์ซ้ำจาก BFCache (พฤติกรรม webview ในแอป) — เด้งกลับบนสุด
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && !userActed) snapTop();
    };
    window.addEventListener("pageshow", onPageShow);

    snapTop();
    hold();
    const stopTimer = window.setTimeout(stopHold, 800);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(stopTimer);
      evts.forEach((e) => window.removeEventListener(e, onUser));
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
