"use client";

import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

// ดึง id เพจจากลิงก์แบบ profile.php?id=... (ถ้าเป็นลิงก์ชื่อผู้ใช้จะได้ null)
function getProfileId(href: string): string | null {
  try {
    return new URL(href).searchParams.get("id");
  } catch {
    return null;
  }
}

// ตรวจว่าเปิดอยู่ในเบราว์เซอร์ในแอป (Messenger/Facebook/IG/LINE/WeChat)
function isInAppBrowser(ua: string): boolean {
  return /\bFBAN|\bFBAV|FB_IAB|FBIOS|Messenger|Instagram|\bLine\b|MicroMessenger/i.test(
    ua,
  );
}

/**
 * ปุ่มลิงก์เฟซบุ๊กที่ฉลาดเรื่องการเปิดบนมือถือ
 *
 * ข้อเท็จจริง (จากการวิจัย): ในเบราว์เซอร์ในแอป Messenger/LINE เฟซบุ๊ก "จงใจ" บล็อก
 * ไม่ให้เปิดแอป Facebook ออกไป (fb:// เป็น no-op, Universal Link ถูกปิด) และการนำทาง
 * ไป facebook.com/profile.php?id=... จะได้ "หน้าขาว" (เฟซบุ๊กเสิร์ฟหน้า login-wall ให้ webview อื่น)
 *
 * ดังนั้น:
 * - ในแอป → ไม่นำทางไปหน้าขาว แต่เด้งกล่องแนะนำให้ "เปิดในเบราว์เซอร์ภายนอก" + คัดลอกลิงก์
 * - เบราว์เซอร์ปกติบนมือถือ → fb:// (iOS) / intent:// (Android) เปิดแอป Facebook ได้จริง
 * - เดสก์ท็อป → ลิงก์ปกติ (เปิดแท็บใหม่)
 */
export function FacebookLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const busyRef = useRef(false);
  const id = getProfileId(href);
  const appUrl = id ? `fb://profile/${id}` : href;

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      const isAndroid = /Android/i.test(ua);
      // เดสก์ท็อป / เบราว์เซอร์อื่น → ปล่อยลิงก์ปกติ (เปิดแท็บใหม่)
      if (!isIOS && !isAndroid) return;
      // คลิกพร้อมปุ่มพิเศษ (เปิดแท็บใหม่ ฯลฯ) → ปล่อยให้เบราว์เซอร์จัดการ
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      // ในเบราว์เซอร์ในแอป → เปิดแอป/หน้าเฟซบุ๊กไม่ได้ → เด้งกล่องแนะนำแทนหน้าขาว
      if (isInAppBrowser(ua)) {
        e.preventDefault();
        setShowHint(true);
        return;
      }

      // เบราว์เซอร์ปกติบนมือถือ → ลองเปิดแอป Facebook จริง
      e.preventDefault();
      if (busyRef.current) return;
      busyRef.current = true;

      if (isAndroid) {
        const path = href.replace(/^https?:\/\//, "");
        // intent:// มี browser_fallback_url ในตัวอยู่แล้ว (ไม่ต้องตั้ง timer ซ้ำ)
        window.location.href =
          `intent://${path}#Intent;scheme=https;package=com.facebook.katana;` +
          `S.browser_fallback_url=${encodeURIComponent(href)};end`;
        return;
      }

      // iOS เบราว์เซอร์ปกติ
      window.location.href = appUrl;
      const t = window.setTimeout(() => {
        window.location.href = href;
      }, 1200);
      const cancel = () => {
        window.clearTimeout(t);
        busyRef.current = false;
      };
      window.addEventListener("pagehide", cancel, { once: true });
      document.addEventListener("visibilitychange", cancel, { once: true });
    },
    [href, appUrl],
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [href]);

  return (
    <>
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>

      {showHint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="วิธีเปิดเฟซบุ๊กร้าน"
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={() => setShowHint(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-amber-300/30 bg-[#0c0d0a] p-5 text-left shadow-2xl"
            onClick={(ev) => ev.stopPropagation()}
          >
            <p className="text-lg font-extrabold text-amber-300">เปิดเฟซบุ๊กร้าน</p>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              แอปนี้เปิดหน้าเฟซบุ๊กไม่ได้ (ขึ้นหน้าขาว) ให้ทำแบบนี้:
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-7 text-zinc-200">
              <li>
                แตะปุ่ม <b>⋯</b> (จุดสามจุด) มุมขวาบน
              </li>
              <li>
                เลือก <b>เปิดในเบราว์เซอร์</b> (Safari/Chrome)
              </li>
              <li>หน้าเฟซบุ๊กจะเปิดได้ตามปกติ</li>
            </ol>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={appUrl}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1877f2] px-5 font-extrabold text-white"
              >
                ลองเปิดในแอป Facebook
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-amber-300/40 px-5 font-bold text-amber-200"
              >
                {copied ? "คัดลอกลิงก์แล้ว ✓" : "คัดลอกลิงก์เฟซบุ๊ก"}
              </button>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="min-h-10 text-sm font-semibold text-zinc-400"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
