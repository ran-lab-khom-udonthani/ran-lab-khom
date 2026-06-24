import { NextRequest } from "next/server";
import QRCode from "qrcode";

// สร้าง QR Code เป็น SVG: /api/qr?data=<ข้อความ/URL>
export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get("data");
  if (!data) {
    return new Response("missing data", { status: 400 });
  }

  try {
    const svg = await QRCode.toString(data, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      width: 320,
    });

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("qr error", { status: 500 });
  }
}
