import Link from "next/link";
import type { ReactNode } from "react";
import { TrackLookupForm } from "@/components/TrackLookupForm";
import { RequestForm } from "@/components/RequestForm";
import { WorkGallery } from "@/components/WorkGallery";
import { ResetScroll } from "@/components/ResetScroll";
import { SITE_URL } from "@/lib/site";
import { prisma } from "@/lib/prisma";

// แกลเลอรีดึงรูปจาก DB มาด้วย — รีเฟรชทุก 2 นาที (และ on-demand ตอนอัป/ลบจากหลังร้าน)
export const revalidate = 120;

const shopName = "ลับคมอุดรธานี";
const shopSubName = "By ช่างเจี๊ยบ";
const mainPhone = "084-428-3946";
const secondPhone = "084-203-1783";
const lineUrl =
  process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/ti/p/nLuK-ZCt72";
const facebookUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_URL ||
  "https://www.facebook.com/profile.php?id=61553739966067";
const qrSrc = `/api/qr?data=${encodeURIComponent(lineUrl)}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "ลับคมอุดรธานี 254/4 ถนนอดุลยเดช หมากแข้ง เมือง อุดรธานี 41000",
)}`;
// ลิงก์ + embed ตำแหน่งร้านจริงบน Google Maps (พิกัด 17.4139241, 102.800179)
const storeMapUrl =
  "https://www.google.com/maps/place/%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B8%A1%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5/@17.4139241,102.800179,18z/data=!4m6!3m5!1s0x31239da254246435:0x3509d147dcddcafc!8m2!3d17.4139241!4d102.800179!16s%2Fg%2F11wfvrx63r";
const storeMapEmbed =
  "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s17.4139241,102.800179!6i16!3m1!1sth!5m1!1sth";
const storeStreetViewEmbed =
  "https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1sxpKLWjcrY4cgx54vuLgGkw!2m2!1d17.4139241!2d102.800179!3f86.59!4f0!5f0.7820865974627469";

// คำถามที่พบบ่อย — ใช้ทั้งแสดงบนหน้า และสร้าง FAQPage structured data (แหล่งเดียวกัน)
const faqs = [
  {
    q: "ร้านลับคมอุดรธานีอยู่ตรงไหน",
    a: "254/4 ถนนอดุลยเดช ต.หมากแข้ง อ.เมือง จ.อุดรธานี 41000 ใกล้โรงเรียนดอนบอสโก ตรงข้าม CR7 สนุกเกอร์ มีหน้าร้านจริง",
  },
  {
    q: "ลับอะไรได้บ้าง",
    a: "กรรไกรตัดผม ซอย ตัดหนัง ปัตตาเลี่ยนคน/สัตว์ มีดครัว แล่ พับ ช่าง มีดแร่ปลา ใบเลื่อย ใบมีดวงกลม และงานอุตสาหกรรม",
  },
  {
    q: "ลับคมราคาเท่าไหร่",
    a: "ราคาขึ้นกับชนิดและสภาพคม ถ่ายรูปส่งทางไลน์ ช่างประเมินราคาให้ก่อนได้ ไม่ต้องเสียเที่ยวมาถึงร้าน",
  },
  {
    q: "ต้องนัดล่วงหน้าไหม",
    a: "โทร 084-428-3946 หรือ 084-203-1783 หรือทักไลน์ หรือกรอกแบบฟอร์มในเว็บ เดี๋ยวช่างติดต่อกลับ",
  },
  {
    q: "รับงานช่างตัดผม ร้านตัดขนสัตว์ ร้านอาหารไหม",
    a: "รับครับ ทั้งช่างตัดผม บาร์เบอร์ ร้านกรูมมิ่งตัดขนสัตว์ ร้านอาหารและงานครัว",
  },
];

// Structured data: ร้านค้าท้องถิ่น — ที่อยู่เป็นภาษาไทยให้ตรงกับที่แสดงบนเว็บ/Facebook (NAP)
// ไม่ใส่พิกัด/เวลาเปิด/รีวิว ที่ยังไม่ยืนยัน
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${SITE_URL}/#business`,
  name: "ร้านลับคมอุดรธานี By ช่างเจี๊ยบ",
  description:
    "รับลับคมกรรไกร ปัตตาเลี่ยน มีด แร่ปลา ใบเลื่อย ใบมีดวงกลม และเครื่องมือคมทุกชนิด มีหน้าร้านในอำเภอเมือง จังหวัดอุดรธานี",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  telephone: "+66844283946",
  priceRange: "฿",
  address: {
    "@type": "PostalAddress",
    streetAddress: "254/4 ถนนอดุลยเดช",
    addressLocality: "ตำบลหมากแข้ง อำเภอเมือง",
    addressRegion: "อุดรธานี",
    postalCode: "41000",
    addressCountry: "TH",
  },
  areaServed: { "@type": "City", name: "อุดรธานี" },
  sameAs: [facebookUrl, lineUrl],
  makesOffer: [
    "ลับคมกรรไกร",
    "ลับคมปัตตาเลี่ยน",
    "ลับคมมีด",
    "ลับมีดแร่ปลา / แล่ปลา",
    "ลับใบเลื่อยและใบมีดวงกลม",
    "จำหน่ายอุปกรณ์ลับคม",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const services = [
  {
    title: "ลับคมกรรไกร",
    short: "กรรไกรตัดผม · กรรไกรซอย · กรรไกรตัดหนัง",
    detail: "คมลื่น ตัดไม่กินผม ไม่ดึง เหมาะกับช่างที่ใช้ทั้งวัน",
    icon: "M7 7l10 10M17 7 7 17M8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  },
  {
    title: "ลับคมปัตตาเลี่ยน",
    short: "ใบมีดปัตตาเลี่ยนคน · ปัตตาเลี่ยนตัดขนสัตว์",
    detail: "ตัดลื่นขึ้น ไม่สะดุด ไม่ดึงขน เครื่องกลับมาเดินคมเหมือนใหม่",
    icon: "M6 6h12v7H6zM8 13v5m4-5v5m4-5v5M9 3v3m6-3v3",
  },
  {
    title: "ลับคมมีด",
    short: "มีดครัว · มีดแล่ · มีดพับ · มีดช่าง",
    detail: "คมเข้าเนื้อง่าย ใช้ออกแรงน้อย ปลอดภัยกว่าฝืนใช้มีดทื่อ",
    icon: "M5 19l9-14 5 5-14 9Zm9-14 5 5",
  },
  {
    title: "ลับมีดแร่ปลา / แล่ปลา",
    short: "สำหรับร้านอาหารและครัวที่ใช้งานหนัก",
    detail: "คมบาง คุมทางเดินมีดง่าย แล่ปลาแล่เนื้อได้เนียนขึ้น",
    icon: "M4 12c4-5 10-5 16 0-6 5-12 5-16 0Zm12 0h4M8 10h.01",
  },
  {
    title: "ใบเลื่อย · ใบมีดวงกลม · งานเฉพาะทาง",
    short: "ใบเลื่อยวงเดือน โซ่เลื่อย ใบมีดวงกลม ใบมีดเครื่องจักร",
    detail: "งานเฉพาะทางส่งรูปให้ช่างดูก่อนได้ ทุกชิ้นตรวจสภาพหน้างานก่อนลงมือ",
    icon: "M12 3v18M5 8h14M7 16h10M8 8l2 8m6-8-2 8",
  },
  {
    title: "จำหน่ายอุปกรณ์ลับคม",
    short: "เครื่องลับคม · ใบมีด · น้ำยาดูแลคม",
    detail: "อุปกรณ์ดูแลใบมีดสำหรับช่างและร้าน สอบถามของในร้านทางไลน์ได้",
    icon: "M5 8h14l-1 12H6L5 8Zm3 0a4 4 0 0 1 8 0",
  },
];

const workGroups = [
  {
    category: "กรรไกร / คีมตัดหนัง",
    description: "งานกรรไกรตัดผม กรรไกรซอย กรรไกรตัดหนัง และคีมงานละเอียด",
    items: [
      {
        title: "กรรไกรงานละเอียด",
        image: "/assets/works/scissors-01.webp",
      },
      {
        title: "กรรไกรชุดใหญ่พร้อมส่งงาน",
        image: "/assets/works/scissors-02.webp",
      },
      {
        title: "คีมตัดหนังและอุปกรณ์ทำเล็บ",
        image: "/assets/works/cuticle-plier-01.webp",
      },
      {
        title: "กรรไกรจำนวนมากจากลูกค้าร้าน",
        image: "/assets/works/scissors-03.webp",
      },
      { title: "กรรไกรหลังลับคม", image: "/assets/works/scissors-n01.webp" },
      { title: "กรรไกรตัดผมงานละเอียด", image: "/assets/works/scissors-n02.webp" },
      { title: "กรรไกรซอยพร้อมส่งงาน", image: "/assets/works/scissors-n03.webp" },
      { title: "กรรไกรชุดสีพร้อมใช้", image: "/assets/works/scissors-n04.webp" },
      { title: "กรรไกร / คีมงานช่าง", image: "/assets/works/scissors-n05.webp" },
      { title: "กรรไกรจำนวนมากจากลูกค้า", image: "/assets/works/scissors-n06.webp" },
      { title: "กรรไกรหลังลับคม", image: "/assets/works/scissors-n07.webp" },
      { title: "กรรไกรตัดผมงานละเอียด", image: "/assets/works/scissors-n08.webp" },
      { title: "กรรไกรซอยพร้อมส่งงาน", image: "/assets/works/scissors-n09.webp" },
      { title: "กรรไกรชุดสีพร้อมใช้", image: "/assets/works/scissors-n10.webp" },
      { title: "กรรไกร / คีมงานช่าง", image: "/assets/works/scissors-n11.webp" },
      { title: "กรรไกรจำนวนมากจากลูกค้า", image: "/assets/works/scissors-n12.webp" },
    ],
  },
  {
    category: "ปัตตาเลี่ยน / ใบมีดช่าง",
    description: "ใบมีดปัตตาเลี่ยนคน สัตว์เลี้ยง และชุดอุปกรณ์ช่างตัดผม",
    items: [
      {
        title: "ใบมีดปัตตาเลี่ยน Andis",
        image: "/assets/works/clipper-blade-01.webp",
      },
      {
        title: "ใบมีดปัตตาเลี่ยนหลายรุ่น",
        image: "/assets/works/clipper-blade-02.webp",
      },
      {
        title: "ชุดปัตตาเลี่ยนและกรรไกรช่าง",
        image: "/assets/works/clipper-scissors-set-01.webp",
      },
      { title: "ใบมีดปัตตาเลี่ยนหลังลับ", image: "/assets/works/clipper-n01.webp" },
      { title: "ใบมีดปัตตาเลี่ยนหลายรุ่น", image: "/assets/works/clipper-n02.webp" },
      { title: "เครื่องปัตตาเลี่ยนพร้อมใช้", image: "/assets/works/clipper-n03.webp" },
      { title: "ชุดใบมีดปัตตาเลี่ยน", image: "/assets/works/clipper-n04.webp" },
      { title: "ใบมีดปัตตาเลี่ยนระยะใกล้", image: "/assets/works/clipper-n05.webp" },
      { title: "ใบมีดปัตตาเลี่ยนหลังลับ", image: "/assets/works/clipper-n06.webp" },
      { title: "ใบมีดปัตตาเลี่ยนหลายรุ่น", image: "/assets/works/clipper-n07.webp" },
      { title: "เครื่องปัตตาเลี่ยนพร้อมใช้", image: "/assets/works/clipper-n08.webp" },
      { title: "ชุดใบมีดปัตตาเลี่ยน", image: "/assets/works/clipper-n09.webp" },
      { title: "ใบมีดปัตตาเลี่ยนระยะใกล้", image: "/assets/works/clipper-n10.webp" },
    ],
  },
  {
    category: "มีดครัว / มีดพับ / มีดแล่",
    description: "มีดครัว มีดแล่ มีดพับ มีดช่าง และมีดใช้งานร้านอาหาร",
    items: [
      {
        title: "มีดพับและมีดพก",
        image: "/assets/works/knife-folding-01.webp",
      },
      {
        title: "มีดพับหลังลับคม",
        image: "/assets/works/knife-folding-02.webp",
      },
      {
        title: "มีดครัวด้ามไม้",
        image: "/assets/works/knife-kitchen-01.webp",
      },
      {
        title: "มีดครัวลับแนวคมใหม่",
        image: "/assets/works/knife-kitchen-02.webp",
      },
      {
        title: "มีดพับหลายขนาด",
        image: "/assets/works/knife-folding-03.webp",
      },
      {
        title: "มีดครัวและมีดจีน",
        image: "/assets/works/knife-kitchen-03.webp",
      },
      {
        title: "มีดใช้งานครัวหลายประเภท",
        image: "/assets/works/knife-mixed-01.webp",
      },
      { title: "มีดหลังลับคม", image: "/assets/works/knife-n01.webp" },
      { title: "มีดครัวพร้อมใช้", image: "/assets/works/knife-n02.webp" },
      { title: "มีดแล่ / มีดพับ", image: "/assets/works/knife-n03.webp" },
      { title: "มีดชุดจากลูกค้า", image: "/assets/works/knife-n04.webp" },
      { title: "มีดงานครัวหลายแบบ", image: "/assets/works/knife-n05.webp" },
      { title: "มีดหลังลับคม", image: "/assets/works/knife-n06.webp" },
      { title: "มีดครัวพร้อมใช้", image: "/assets/works/knife-n07.webp" },
      { title: "มีดแล่ / มีดพับ", image: "/assets/works/knife-n08.webp" },
      { title: "มีดชุดจากลูกค้า", image: "/assets/works/knife-n09.webp" },
      { title: "มีดงานครัวหลายแบบ", image: "/assets/works/knife-n10.webp" },
    ],
  },
  {
    category: "ใบเลื่อย / โซ่เลื่อย",
    description: "ใบเลื่อยวงเดือน โซ่เลื่อยยนต์ และคมฟันเลื่อยเฉพาะทาง",
    items: [
      {
        title: "ใบเลื่อยวงเดือน",
        image: "/assets/works/saw-blade-01.webp",
      },
      {
        title: "ตั้งองศาฟันใบเลื่อย",
        image: "/assets/works/saw-blade-02.webp",
      },
      {
        title: "โซ่เลื่อยยนต์หลังลับ",
        image: "/assets/works/chainsaw-01.webp",
      },
      {
        title: "โซ่เลื่อยจัดชุดบนแผ่นรอง",
        image: "/assets/works/chainsaw-02.webp",
      },
      {
        title: "ลับฟันใบเลื่อยกับเครื่องเฉพาะทาง",
        image: "/assets/works/saw-blade-03.webp",
      },
      {
        title: "คมฟันใบเลื่อยระยะใกล้",
        image: "/assets/works/saw-blade-04.webp",
      },
      { title: "ใบเลื่อยหลังลับคม", image: "/assets/works/saw-n01.webp" },
      { title: "ใบเลื่อยวงเดือนหลังลับ", image: "/assets/works/saw-n02.webp" },
    ],
  },
  {
    category: "ใบมีดวงกลม / ใบสไลซ์",
    description: "ใบมีดวงกลม ใบสไลซ์อาหาร และใบมีดเครื่องจักรทรงกลม",
    items: [
      {
        title: "ใบมีดวงกลมหลายขนาด",
        image: "/assets/works/round-blade-01.webp",
      },
      {
        title: "ใบมีดวงกลมขนาดใหญ่",
        image: "/assets/works/round-blade-02.webp",
      },
      {
        title: "ตรวจผิวคมใบมีดวงกลม",
        image: "/assets/works/round-blade-03.webp",
      },
      {
        title: "สันคมใบมีดวงกลม",
        image: "/assets/works/round-blade-04.webp",
      },
      {
        title: "ใบสไลซ์ขัดคมพร้อมใช้งาน",
        image: "/assets/works/round-blade-05.webp",
      },
      { title: "ใบมีดวงกลมหลังลับ", image: "/assets/works/round-n01.webp" },
      { title: "ใบมีดวงกลมหลายขนาด", image: "/assets/works/round-n02.webp" },
      { title: "ใบสไลซ์พร้อมใช้", image: "/assets/works/round-n03.webp" },
      { title: "สันคมใบมีดวงกลม", image: "/assets/works/round-n04.webp" },
      { title: "ใบมีดวงกลมหลังลับ", image: "/assets/works/round-n05.webp" },
      { title: "ใบมีดวงกลมหลายขนาด", image: "/assets/works/round-n06.webp" },
      { title: "ใบสไลซ์พร้อมใช้", image: "/assets/works/round-n07.webp" },
      { title: "สันคมใบมีดวงกลม", image: "/assets/works/round-n08.webp" },
    ],
  },
  {
    category: "เครื่องมือเฉพาะทาง / อุตสาหกรรม",
    description:
      "ใบมีดยาว ใบมีดเครื่องบด ใบกัดไม้ และเครื่องมือพิเศษที่ประเมินหน้างาน",
    items: [
      {
        title: "ใบมีดยาวงานเครื่องจักร",
        image: "/assets/works/industrial-blade-01.webp",
      },
      {
        title: "ใบมีดอุตสาหกรรมหลายชิ้น",
        image: "/assets/works/industrial-blade-02.webp",
      },
      {
        title: "ใบมีดอุตสาหกรรมขนาดใหญ่",
        image: "/assets/works/industrial-blade-03.webp",
      },
      {
        title: "เครื่องมือเฉพาะทาง",
        image: "/assets/works/special-tool-01.webp",
      },
      {
        title: "ใบมีดเครื่องบด",
        image: "/assets/works/grinder-blade-01.webp",
      },
      {
        title: "ใบกัดไม้และคมฟันคาร์ไบด์",
        image: "/assets/works/wood-cutter-01.webp",
      },
      {
        title: "คมใบกัดไม้ระยะใกล้",
        image: "/assets/works/wood-cutter-02.webp",
      },
      { title: "ใบกัดไม้ / คาร์ไบด์หลังลับ", image: "/assets/works/industrial-n01.webp" },
      { title: "ใบมีดมิลลิ่งงานเฉพาะทาง", image: "/assets/works/industrial-n02.webp" },
      { title: "เครื่องมืออุตสาหกรรมหลังลับ", image: "/assets/works/industrial-n03.webp" },
      { title: "ใบกัดไม้ / คาร์ไบด์หลังลับ", image: "/assets/works/industrial-n04.webp" },
      { title: "ใบมีดมิลลิ่งงานเฉพาะทาง", image: "/assets/works/industrial-n05.webp" },
      { title: "เครื่องมืออุตสาหกรรมหลังลับ", image: "/assets/works/industrial-n06.webp" },
    ],
  },
];

function ToolIcon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d={path} />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.67 2.8a2 2 0 0 1-.45 2.11L8.1 9.86a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45c.9.32 1.84.54 2.8.67A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <span className="grid h-5 w-8 place-items-center rounded bg-[#06c755] text-[10px] font-black leading-none text-white">
      LINE
    </span>
  );
}

function BrandMark() {
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-300/50 bg-amber-400 text-black shadow-[0_0_28px_rgba(245,158,11,0.32)]">
      <svg
        aria-hidden="true"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M7 7l10 10M17 7 7 17" />
        <path d="M8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM20 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
      </svg>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  align = "center",
  children,
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
  children?: ReactNode;
}) {
  const wrap =
    align === "center"
      ? "mx-auto mb-10 max-w-3xl text-center"
      : "mb-10 max-w-3xl text-left";
  return (
    <div className={wrap}>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white md:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-3 text-base leading-8 text-zinc-300">{children}</p>
      ) : null}
    </div>
  );
}

// อ่านรูปแกลเลอรีจาก DB แล้วจัดกลุ่มตามหมวด (พังเงียบ ๆ ถ้า DB มีปัญหา — เว็บยังขึ้นได้)
async function galleryFromDb(): Promise<
  Record<string, { title: string; image: string }[]>
> {
  try {
    const photos = await prisma.galleryPhoto.findMany({
      orderBy: { createdAt: "desc" },
      select: { url: true, category: true, caption: true },
    });
    const map: Record<string, { title: string; image: string }[]> = {};
    for (const p of photos) {
      (map[p.category] ??= []).push({
        title: p.caption || "งานลับคมจากร้าน",
        image: p.url,
      });
    }
    return map;
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const dbByCat = await galleryFromDb();
  // รวมรูป static (ในโค้ด) + รูปจาก DB เข้าหมวดเดียวกัน
  const galleryGroups = workGroups.map((g) => ({
    ...g,
    items: [...g.items, ...(dbByCat[g.category] ?? [])],
  }));
  return (
    <main className="min-h-screen overflow-hidden bg-[#070806] pb-24 text-white md:pb-0">
      <ResetScroll />
      {/* Structured data ให้ Google เข้าใจว่าเป็นร้านค้าท้องถิ่นในอุดรธานี */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandMark />
            <span className="min-w-0">
              <span className="block truncate text-lg font-black leading-tight text-amber-300 md:text-xl">
                {shopName}
              </span>
              <span className="block text-xs font-bold text-white/80">
                {shopSubName}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-zinc-200 lg:flex">
            <a className="transition hover:text-amber-300" href="#gallery">
              ผลงานจริง
            </a>
            <a className="transition hover:text-amber-300" href="#services">
              บริการ
            </a>
            <a className="transition hover:text-amber-300" href="#request">
              ส่งงานลับคม
            </a>
            <a className="transition hover:text-amber-300" href="#contact">
              ติดต่อร้าน
            </a>
          </nav>

          {/* ปุ่มโทรฝั่งขวาบนจอใหญ่ */}
          <a
            className="hidden min-h-12 items-center gap-2 rounded-full bg-amber-400 px-5 text-sm font-black text-black shadow-[0_0_28px_rgba(245,158,11,0.36)] transition hover:bg-amber-300 md:flex"
            href={`tel:${mainPhone.replaceAll("-", "")}`}
          >
            <PhoneIcon />
            โทรหาช่าง {mainPhone}
          </a>

          {/* ปุ่มติดต่อสำหรับมือถือ — ไลน์ + โทร */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={lineUrl}
              aria-label="แอดไลน์"
              className="grid h-11 w-11 place-items-center rounded-full bg-[#06c755] text-white"
            >
              <LineIcon />
            </a>
            <a
              href={`tel:${mainPhone.replaceAll("-", "")}`}
              aria-label="โทรหาช่าง"
              className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-black"
            >
              <PhoneIcon />
            </a>
          </div>
        </div>
      </header>

      {/* HERO — ข้อความล้วน ไม่มีรูปประกอบ (พื้นหลังไล่สีทอง/ดำ) */}
      <section className="relative min-h-[640px] overflow-hidden pt-24 md:min-h-[600px]">
        <div className="absolute inset-0 bg-[#070806]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(251,191,36,0.20),transparent_42%),radial-gradient(circle_at_85%_70%,rgba(245,158,11,0.10),transparent_45%),linear-gradient(180deg,#070806_60%,#0a0b08_100%)]" />

        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-6">
          <div className="max-w-3xl fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-black/50 px-4 py-2 text-sm font-bold text-amber-200 shadow-[0_0_36px_rgba(245,158,11,0.18)]">
              <span className="h-2 w-2 rounded-full bg-[#06c755]" />
              ร้านลับคมอุดรธานี · เปิดจริง รับงานจริง
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-normal text-white sm:text-6xl sm:leading-[1.02] lg:text-7xl">
              ลับคมอุดรธานี
              <span className="mt-2 block text-amber-300">By ช่างเจี๊ยบ</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl font-bold leading-8 text-white sm:mt-5 sm:text-2xl sm:leading-10">
              คมกลับมาเหมือนใหม่ ใช้งานได้จริง
            </p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg sm:leading-9">
              รับลับคมกรรไกร ปัตตาเลี่ยน มีด แร่ปลา ใบเลื่อย ใบมีดวงกลม
              และเครื่องมือคมเฉพาะทาง ลับด้วยเครื่องมือของช่างโดยตรง
              ดูงานทุกชิ้นก่อนส่งคืน รับงานช่างตัดผม ร้านตัดขนสัตว์ ร้านอาหาร
              และงานครัว
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a className="btn-line" href={lineUrl}>
                <LineIcon />
                แอดไลน์ส่งรูปสอบถาม
              </a>
              <a
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#1877f2] px-6 text-base font-extrabold text-white transition hover:-translate-y-0.5 hover:brightness-110"
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
                เฟซบุ๊กร้าน
              </a>
              <a
                className="btn-gold"
                href={storeMapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPinIcon />
                นำทางไป Google Maps
              </a>
            </div>
            <a
              href="#request"
              className="mt-4 inline-block text-sm font-extrabold text-amber-200 underline-offset-4 hover:underline"
            >
              หรือ ส่งคำขอออนไลน์ ↓
            </a>
          </div>

          <aside className="mx-auto hidden w-full max-w-sm overflow-hidden rounded-2xl border border-amber-300/25 bg-black/45 shadow-[0_0_46px_rgba(0,0,0,0.62)] backdrop-blur fade-up md:block md:justify-self-end">
            {/* คลิกที่ใดก็ได้บนแผนที่/หน้าร้าน → เปิดตำแหน่งร้านบน Google Maps */}
            <a
              href={storeMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="เปิดแผนที่ร้านลับคมอุดรธานีบน Google Maps"
              className="group relative block"
            >
              {/* แผนที่ร้าน */}
              <iframe
                src={storeMapEmbed}
                title="แผนที่ร้านลับคมอุดรธานี"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                className="pointer-events-none block h-44 w-full"
              />
              {/* หน้าร้านจริง (Street View) */}
              <span className="block border-t border-white/10">
                <iframe
                  src={storeStreetViewEmbed}
                  title="หน้าร้านลับคมอุดรธานี (Street View)"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                  className="pointer-events-none block h-40 w-full"
                />
              </span>
              {/* ป้ายชวนแตะ */}
              <span className="pointer-events-none absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-extrabold text-black shadow-lg transition group-hover:bg-amber-300">
                <MapPinIcon />
                แตะเพื่อนำทาง
              </span>
            </a>
            <div className="p-5 text-center">
              <p className="text-lg font-extrabold text-amber-300">
                แผนที่ร้าน · หน้าร้านจริง
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-300">
                254/4 ถนนอดุลยเดช ต.หมากแข้ง อ.เมือง จ.อุดรธานี — แตะแผนที่เพื่อเปิดนำทางได้เลย
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* การ์ดที่อยู่จัดส่ง — สไตล์ป้าย/สติกเกอร์หน้าพัสดุ ปณ. */}
      <section className="border-y border-white/10 bg-[#070806] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-xl">
          <div className="fade-up relative overflow-hidden rounded-2xl bg-[#fbf7ec] text-zinc-900 shadow-[0_18px_60px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
            {/* แถบหัวป้าย */}
            <div className="flex items-center justify-between gap-3 bg-amber-400 px-5 py-3">
              <span className="inline-flex items-center gap-2 text-base font-extrabold uppercase tracking-[0.14em] text-black">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
                  <path d="M12 22.08V12" />
                </svg>
                ที่อยู่จัดส่ง
              </span>
              {/* ตราไปรษณีย์จำลอง */}
              <span className="rounded-md border-2 border-dashed border-black/50 px-2 py-1 text-[11px] font-black leading-none text-black/70">
                ปณ.
              </span>
            </div>

            {/* เนื้อหาที่อยู่ — ชิดซ้ายเหมือนจ่าหน้าพัสดุ */}
            <div className="space-y-3 px-6 py-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  ผู้รับ / กรุณาส่งถึง
                </p>
                <p className="mt-1 text-2xl font-extrabold leading-tight text-zinc-900 md:text-3xl">
                  นางสาวรุจิรา กุลศร
                </p>
              </div>

              <p className="text-lg font-bold leading-8 text-zinc-800">
                ลับคมอุดรธานี
                <br />
                254/4 ถนนอดุลยเดช
                <br />
                ตำบลหมากแข้ง อำเภอเมือง
                <br />
                จังหวัดอุดรธานี 41000
              </p>

              <div className="flex items-center gap-2 border-t border-dashed border-zinc-300 pt-3">
                <span className="text-base font-bold text-zinc-600">โทร.</span>
                <a
                  href={`tel:${mainPhone.replaceAll("-", "")}`}
                  className="text-xl font-extrabold tracking-wide text-zinc-900 underline-offset-2 hover:underline"
                >
                  {mainPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* แกลเลอรี — พระเอกของหน้า ขึ้นนำก่อนทุกอย่าง */}
      <section
        id="gallery"
        className="scroll-mt-24 bg-[#070806] px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <WorkGallery groups={galleryGroups} />
        </div>
      </section>

      {/* บริการ */}
      <section
        id="services"
        className="scroll-mt-24 border-t border-white/10 bg-[#0d0f0b] px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="บริการของเรา" title="รับลับคมอะไรบ้าง">
            ลับให้ทุกอย่างที่มีคม ตั้งแต่กรรไกรช่างไปจนถึงใบมีดเครื่องจักร
            ไม่แน่ใจว่าลับได้ไหม ส่งรูปมาถามช่างได้เลย
          </SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <article
                className="card-dark group p-5 transition hover:-translate-y-1 hover:border-amber-300/70"
                key={service.title}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-400 text-black shadow-[0_0_26px_rgba(245,158,11,0.28)]">
                    <ToolIcon path={service.icon} />
                  </div>
                  <a
                    className="rounded-full border border-amber-300/50 px-4 py-2 text-sm font-bold text-amber-200 transition group-hover:bg-amber-300 group-hover:text-black"
                    href={lineUrl}
                  >
                    สอบถามราคา
                  </a>
                </div>
                <h3 className="text-2xl font-extrabold leading-tight text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-base font-bold text-amber-200">
                  {service.short}
                </p>
                <p className="mt-3 leading-8 text-zinc-300">{service.detail}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-base text-zinc-300">
            เลือกหมวดที่ต้องการแล้ว{" "}
            <a
              href="#request"
              className="font-extrabold text-amber-300 underline-offset-4 hover:underline"
            >
              ส่งคำขอลับคมด้านล่างได้เลย ↓
            </a>
          </p>
        </div>
      </section>

      {/* ฟอร์มส่งคำขอออนไลน์ */}
      <section
        id="request"
        className="scroll-mt-24 bg-[#070806] px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="ส่งงานออนไลน์" title="ส่งคำขอลับคม ช่างโทรกลับ">
            เลือกหมวดของที่จะลับ แล้วฝากเบอร์ไว้
            เดี๋ยวช่างโทรกลับไปคุยเรื่องคิวและราคาเอง
          </SectionTitle>
          <div className="card-gold p-6 md:p-8">
            <RequestForm />
          </div>
        </div>
      </section>

      {/* ราคา & สถานะงาน */}
      <section
        id="pricing"
        className="scroll-mt-24 border-t border-white/10 bg-[#0d0f0b] px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            align="left"
            eyebrow="ราคา & สถานะงาน"
            title="สอบถามราคา & เช็กสถานะงาน"
          />
          <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
            <div className="card-gold p-6 md:p-8">
              <h3 className="text-2xl font-extrabold text-white">สอบถามราคา</h3>
              <p className="mt-3 text-lg leading-9 text-zinc-200">
                ราคาขึ้นกับชนิดของและสภาพคม ถ่ายรูปส่งมาทางไลน์
                ช่างบอกราคาคร่าว ๆ ให้ก่อนได้ ไม่ต้องเสียเที่ยวมาถึงร้าน
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a className="btn-line" href={lineUrl}>
                  <LineIcon />
                  ส่งรูปให้ช่างประเมินราคา
                </a>
                <a className="btn-ghost-gold" href="#request">
                  หรือ ส่งคำขอออนไลน์
                </a>
              </div>
            </div>

            <div className="card-gold p-6 md:p-8">
              <h3 className="text-2xl font-extrabold text-white">
                เช็กสถานะงานของคุณ
              </h3>
              <p className="mb-4 mt-1 text-base leading-7 text-zinc-300">
                กรอกรหัสงานที่อยู่บนใบรับงาน (หรือสแกน QR บนใบรับงาน)
                ดูได้เลยว่างานถึงไหนแล้ว
              </p>
              <TrackLookupForm />
            </div>
          </div>
        </div>
      </section>

      {/* คำถามที่พบบ่อย — ตอบลูกค้าก่อนโทร + ช่วย SEO คำค้นยาว */}
      <section
        id="faq"
        className="scroll-mt-24 border-t border-white/10 bg-[#070806] px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="คำถามที่พบบ่อย" title="เรื่องที่ลูกค้าถามบ่อย" />
          <div className="space-y-3">
            {faqs.map((f) => (
              <div className="card-dark p-5" key={f.q}>
                <h3 className="text-lg font-extrabold text-amber-200">{f.q}</h3>
                <p className="mt-2 leading-8 text-zinc-300">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ติดต่อร้าน */}
      <section
        id="contact"
        className="scroll-mt-24 bg-[#070806] px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            align="left"
            eyebrow="ติดต่อร้าน"
            title="ติดต่อร้านลับคมอุดรธานี By ช่างเจี๊ยบ"
          />
          <div className="grid gap-6 md:grid-cols-[1fr_0.72fr]">
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 transition hover:border-amber-300/70"
                  href={`tel:${mainPhone.replaceAll("-", "")}`}
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-amber-300">
                    <PhoneIcon />
                    โทรหาช่างเจี๊ยบ
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {mainPhone}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">แตะเพื่อโทร</p>
                </a>
                <a
                  className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 transition hover:border-amber-300/70"
                  href={`tel:${secondPhone.replaceAll("-", "")}`}
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-amber-300">
                    <PhoneIcon />
                    โทรหาปอมขาวหน้าหมี
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {secondPhone}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">แตะเพื่อโทร</p>
                </a>
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                <p className="font-extrabold text-amber-200">
                  Facebook: ลับคมอุดรธานี by ช่างเจี๊ยบ
                </p>
                <p className="mt-3 leading-8 text-zinc-300">
                  รุจิรา กุลศร — ลับคมอุดรธานี / 254/4 ถนนอดุลยเดช
                  ต.หมากแข้ง อ.เมือง จ.อุดรธานี 41000
                </p>
                <p className="mt-2 leading-8 text-zinc-300">
                  ร้านอยู่ทาง ร.ร.ดอนบอสโก ถนนโพศรี ตรงข้าม CR7 สนุกเกอร์
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a className="btn-gold" href={mapsUrl}>
                    <MapPinIcon />
                    นำทางไป Google Maps
                  </a>
                  <a
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#1877f2] px-5 font-extrabold text-white"
                    href={facebookUrl}
                  >
                    f
                    <span>Facebook</span>
                  </a>
                  <Link
                    className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 px-5 font-extrabold text-zinc-100 transition hover:border-amber-300 hover:text-amber-200"
                    href="/admin"
                  >
                    สำหรับพนักงานร้าน
                  </Link>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-amber-300/30 bg-black/60 p-5">
              <div className="rounded-2xl bg-white p-3">
                <img
                  alt="QR Code สำหรับเพิ่มเพื่อน Line ร้านลับคมอุดรธานี"
                  className="aspect-square w-full"
                  src={qrSrc}
                />
              </div>
              <p className="mt-4 text-center text-xl font-extrabold text-amber-300">
                แอดไลน์ ถามคิวและราคา
              </p>
              <p className="mt-2 text-center text-sm leading-6 text-zinc-300">
                ถ่ายรูปเครื่องมือส่งเข้ามา ช่างประเมินให้ทันที
              </p>
            </aside>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-xl font-black text-amber-300">
                ลับคมอุดรธานี
              </p>
              <p className="text-sm font-semibold text-zinc-300">
                By ช่างเจี๊ยบ — ลับคมอุดรธานี รับงานจริงทุกชนิด
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#06c755] px-4 font-extrabold text-white"
              href={lineUrl}
            >
              <LineIcon />
              แอดไลน์
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-amber-400 px-4 font-extrabold text-black"
              href={`tel:${mainPhone.replaceAll("-", "")}`}
            >
              <PhoneIcon />
              โทรร้าน
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1877f2] px-5 font-extrabold text-white"
              href={facebookUrl}
            >
              Facebook
            </a>
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            © 2026 ลับคมอุดรธานี By ช่างเจี๊ยบ · อุดรธานี
          </p>
          <a
            className="text-sm font-semibold text-zinc-400 underline-offset-4 hover:text-amber-300 hover:underline"
            href={mapsUrl}
          >
            แผนที่ร้าน
          </a>
        </div>
      </footer>

      {/* แถบปุ่มล่างสำหรับมือถือ — เผื่อขอบ safe-area ของ iPhone */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-black/90 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <a
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#06c755] text-base font-extrabold text-white"
          href={lineUrl}
        >
          <LineIcon />
          แอดไลน์
        </a>
        <a
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-amber-400 text-base font-extrabold text-black"
          href={`tel:${mainPhone.replaceAll("-", "")}`}
        >
          <PhoneIcon />
          โทรร้าน
        </a>
      </div>
    </main>
  );
}
