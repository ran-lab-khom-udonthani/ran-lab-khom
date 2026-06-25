import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "ร้านลับคมอุดรธานี By ช่างเจี๊ยบ — รับลับคมทุกชนิดในอุดรธานี";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ดึงเฉพาะ glyph ไทยที่ใช้จริงจาก Google Fonts (เบา) — ถ้าล้มเหลวคืน null แล้ว fallback
async function loadThaiFont(
  text: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@${weight}&text=${encodeURIComponent(
      text,
    )}`;
    const css = await (await fetch(url)).text();
    const match = css.match(/src: url\((.+?)\) format\(/);
    if (!match) return null;
    return await (await fetch(match[1]).then((r) => r)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const title = "ร้านลับคมอุดรธานี";
  const sub = "By ช่างเจี๊ยบ";
  const line3 = "ลับกรรไกร · ปัตตาเลี่ยน · มีด · ใบเลื่อย · ใบมีดวงกลม";
  const tagline = "คมกลับมาเหมือนใหม่ ใช้งานได้จริง";
  const footer = "มีหน้าร้านในอุดรธานี · โทร 084-428-3946";
  const allText = title + sub + line3 + tagline + footer + "LINE";

  const [bold, regular] = await Promise.all([
    loadThaiFont(allText, 700),
    loadThaiFont(allText, 400),
  ]);

  const fonts = [
    bold && {
      name: "NotoThai",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
    regular && {
      name: "NotoThai",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: "normal";
  }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: "#070806",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(251,191,36,0.22), transparent 45%), radial-gradient(circle at 88% 78%, rgba(245,158,11,0.12), transparent 45%)",
          color: "#ffffff",
          fontFamily: "NotoThai",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              display: "flex",
              width: "92px",
              height: "92px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "22px",
              backgroundColor: "#fbbf24",
              color: "#0a0a0a",
              fontSize: "52px",
            }}
          >
            ✂
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              color: "#fcd34d",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            {footer}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "40px",
          }}
        >
          <div style={{ display: "flex", fontSize: "90px", fontWeight: 700 }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "56px",
              fontWeight: 700,
              color: "#fbbf24",
              marginTop: "6px",
            }}
          >
            {sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "30px",
            fontSize: "34px",
            color: "#e4e4e7",
          }}
        >
          {line3}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "14px",
            fontSize: "30px",
            color: "#a1a1aa",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
