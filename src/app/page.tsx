import Link from "next/link";
import type { ReactNode } from "react";
import { TrackLookupForm } from "@/components/TrackLookupForm";
import { RequestForm } from "@/components/RequestForm";

const shopName = "ลับคมอุดรธานี";
const shopSubName = "By ช่างเจี๊ยบ";
const mainPhone = "084-428-3946";
const secondPhone = "084-203-1783";
const lineUrl =
  process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/R/ti/p/~0844283946";
const facebookUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_URL ||
  "https://www.facebook.com/search/top?q=%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B8%A1%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5%20by%20%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%88%E0%B8%B5%E0%B9%8A%E0%B8%A2%E0%B8%9A";
const qrSrc = `/api/qr?data=${encodeURIComponent(lineUrl)}`;

const services = [
  {
    title: "ลับคมกรรไกร",
    short: "กรรไกรตัดผม กรรไกรซอย กรรไกรตัดหนัง",
    detail: "คมกริบ ตัดลื่น ไม่กินเส้นผม เหมาะกับงานหน้าร้านและงานมืออาชีพ",
    icon: "M7 7l10 10M17 7 7 17M8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  },
  {
    title: "ลับคมปัตตาเลี่ยน",
    short: "ใบมีดปัตตาเลี่ยนคนและสัตว์เลี้ยง",
    detail: "ลดสะดุด ลดดึงขน ช่วยให้เครื่องกลับมาตัดได้เนียนและลื่นขึ้น",
    icon: "M6 6h12v7H6zM8 13v5m4-5v5m4-5v5M9 3v3m6-3v3",
  },
  {
    title: "ลับคมมีด",
    short: "มีดครัว มีดแล่ มีดช่าง",
    detail: "คมทน ใช้งานง่าย คุมแรงได้ดี และปลอดภัยกว่าการฝืนใช้มีดทื่อ",
    icon: "M5 19l9-14 5 5-14 9Zm9-14 5 5",
  },
  {
    title: "แร่ปลา / แล่ปลา",
    short: "งานร้านอาหารและครัวมืออาชีพ",
    detail: "คมบาง คุมทิศทางง่าย ช่วยให้งานแล่ปลาและแล่เนื้อเรียบร้อยขึ้น",
    icon: "M4 12c4-5 10-5 16 0-6 5-12 5-16 0Zm12 0h4M8 10h.01",
  },
  {
    title: "เครื่องมือคมอื่น ๆ",
    short: "อุปกรณ์เฉพาะทางหลายประเภท",
    detail: "ส่งรูปให้ช่างประเมินก่อนได้ ตรวจสภาพหน้างานก่อนลับทุกชิ้น",
    icon: "M12 3v18M5 8h14M7 16h10M8 8l2 8m6-8-2 8",
  },
  {
    title: "จำหน่ายอุปกรณ์ลับคม",
    short: "เครื่องลับคม ใบมีด และน้ำยา",
    detail: "อุปกรณ์ดูแลใบมีดและสินค้าที่เกี่ยวข้องสำหรับร้านและช่างมืออาชีพ",
    icon: "M5 8h14l-1 12H6L5 8Zm3 0a4 4 0 0 1 8 0",
  },
];

const processSteps = [
  "ส่งรูปหรือเอาเครื่องมือเข้ามาที่ร้าน",
  "ช่างตรวจสภาพคมและใบมีด",
  "ลับคมด้วยเครื่องมือเฉพาะทาง",
  "ทดสอบความคมก่อนส่งมอบ",
];

const trustItems = [
  "ใช้เครื่องลับคม Resin Diamond",
  "งานละเอียดโดยช่างมีประสบการณ์",
  "เหมาะกับช่างตัดผม ช่างตัดขนสัตว์ ร้านอาหาร และงานครัว",
  "มีหน้าร้านจริง ติดต่อได้จริง",
  "ตรวจเช็คก่อนส่งมอบทุกชิ้น",
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
    ],
  },
  {
    category: "เครื่องมือเฉพาะทาง / อุตสาหกรรม",
    description: "ใบมีดยาว ใบมีดเครื่องบด ใบกัดไม้ และเครื่องมือพิเศษที่ประเมินหน้างาน",
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

function LineIcon() {
  return (
    <span className="grid h-5 w-8 place-items-center rounded bg-[#06c755] text-[10px] font-black leading-none text-white">
      LINE
    </span>
  );
}

function BrandMark() {
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-amber-300/50 bg-amber-400 text-black shadow-[0_0_28px_rgba(245,158,11,0.32)]">
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
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-3 text-base leading-8 text-zinc-300">{children}</p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070806] pb-24 text-white md:pb-0">
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
            <a className="transition hover:text-amber-300" href="#services">
              บริการ
            </a>
            <a className="transition hover:text-amber-300" href="#request">
              ขอลับคม
            </a>
            <a className="transition hover:text-amber-300" href="#experience">
              บรรยากาศร้าน
            </a>
            <a className="transition hover:text-amber-300" href="#process">
              ขั้นตอนบริการ
            </a>
            <a className="transition hover:text-amber-300" href="#gallery">
              ตัวอย่างงาน
            </a>
            <a className="transition hover:text-amber-300" href="#contact">
              ติดต่อ
            </a>
          </nav>

          <a
            className="hidden min-h-12 items-center gap-2 rounded-full bg-amber-400 px-5 text-sm font-black text-black shadow-[0_0_28px_rgba(245,158,11,0.36)] transition hover:bg-amber-300 md:flex"
            href={`tel:${mainPhone.replaceAll("-", "")}`}
          >
            <PhoneIcon />
            {mainPhone}
          </a>
        </div>
      </header>

      <section className="relative min-h-[820px] overflow-hidden pt-24 md:min-h-[760px]">
        <img
          alt="บรรยากาศร้านลับคมระดับพรีเมียม โทนทองดำ มีเคาน์เตอร์รับงานและเครื่องลับคม"
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
          src="/assets/sharpening-studio-hero.webp"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.68)_37%,rgba(0,0,0,0.18)_72%,rgba(0,0,0,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(251,191,36,0.26),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0)_70%,#070806_100%)]" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-6">
          <div className="max-w-3xl fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-black/50 px-4 py-2 text-sm font-bold text-amber-200 shadow-[0_0_36px_rgba(245,158,11,0.18)]">
              <span className="h-2 w-2 rounded-full bg-[#06c755]" />
              Sharpening Studio Experience
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
              ลับคมอุดรธานี
              <span className="mt-2 block text-amber-300">By ช่างเจี๊ยบ</span>
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-bold leading-10 text-white">
              บริการลับคมมืออาชีพ คมจริง ใช้งานดี
            </p>
            <p className="mt-3 max-w-2xl text-lg leading-9 text-zinc-200">
              รับลับคมกรรไกร ปัตตาเลี่ยน มีด แร่ปลา และเครื่องมือคมทุกชนิด
              ดูแลคมด้วยเครื่องมือเฉพาะทาง เหมาะสำหรับช่างตัดผม
              ร้านตัดขนสัตว์ ร้านอาหาร และงานครัวมืออาชีพ
            </p>

            <div className="mt-7 hidden flex-col gap-3 sm:flex sm:flex-row">
              <a
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-amber-400 px-7 text-base font-black text-black shadow-[0_0_30px_rgba(245,158,11,0.42)] transition hover:-translate-y-0.5 hover:bg-amber-300"
                href={lineUrl}
              >
                <LineIcon />
                แอด Line เพื่อสอบถาม
              </a>
              <a
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-amber-300/70 bg-black/30 px-7 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-300 hover:text-black"
                href={`tel:${mainPhone.replaceAll("-", "")}`}
              >
                <PhoneIcon />
                โทรหาช่างเจี๊ยบ
              </a>
            </div>

            <div className="mt-9 hidden max-w-3xl gap-3 text-sm font-semibold text-zinc-200 sm:grid sm:grid-cols-3">
              {["เห็นป้ายหน้าร้าน", "คุยกับช่างที่เคาน์เตอร์", "รับงานคมก่อนส่งมอบ"].map(
                (item, index) => (
                  <div
                    className="rounded-lg border border-white/10 bg-black/40 p-4 backdrop-blur"
                    key={item}
                  >
                    <span className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-sm font-black text-black">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="mx-auto w-full max-w-sm rounded-lg border border-amber-300/30 bg-black/70 p-5 shadow-[0_0_46px_rgba(0,0,0,0.62)] backdrop-blur fade-up md:justify-self-end">
            <div className="rounded-lg bg-white p-3">
              <img
                alt="QR Code สำหรับแอดไลน์ร้านลับคมอุดรธานี By ช่างเจี๊ยบ"
                className="aspect-square w-full"
                src={qrSrc}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-xl font-black text-amber-300">
                สแกนแอดไลน์
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-300">
                ส่งรูปเครื่องมือให้ช่างช่วยประเมินก่อนเข้าร้านได้
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="relative px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Our Services" title="เลือกบริการลับคมที่ต้องการ">
            งานลับคมสำหรับช่างตัดผม ร้านตัดขนสัตว์ ร้านอาหาร งานครัว
            และเครื่องมือคมที่ต้องการความละเอียด
          </SectionTitle>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                className="group rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035))] p-5 shadow-[0_14px_50px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-amber-300/70"
                key={service.title}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-lg bg-amber-400 text-black shadow-[0_0_26px_rgba(245,158,11,0.28)]">
                    <ToolIcon path={service.icon} />
                  </div>
                  <a
                    className="rounded-full border border-amber-300/50 px-4 py-2 text-sm font-bold text-amber-200 transition group-hover:bg-amber-300 group-hover:text-black"
                    href={lineUrl}
                  >
                    สอบถามราคา
                  </a>
                </div>
                <h3 className="text-2xl font-black leading-tight text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-base font-bold text-amber-200">
                  {service.short}
                </p>
                <p className="mt-3 leading-8 text-zinc-300">{service.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Online Request" title="ส่งคำขอลับคมออนไลน์">
            เลือกหมวดคมที่จะนำมาลับ แล้วฝากเบอร์ไว้ — ช่างจะติดต่อกลับและช่วยประเมินให้
          </SectionTitle>
          <div className="rounded-2xl border border-amber-300/20 bg-black/40 p-6 md:p-8">
            <RequestForm />
          </div>
        </div>
      </section>

      <section
        id="experience"
        className="relative overflow-hidden border-y border-white/10 bg-[#10120e] py-16 md:py-24"
      >
        <div className="absolute inset-0 opacity-35">
          <img
            alt=""
            className="h-full w-full object-cover"
            decoding="async"
            loading="lazy"
            src="/assets/sharpening-studio-hero.webp"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070806_0%,rgba(7,8,6,0.82)_46%,rgba(7,8,6,0.48)_100%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-6">
          <div className="self-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
              Interior Experience
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
              บรรยากาศร้านลับคมระดับมืออาชีพ
            </h2>
            <p className="mt-5 text-lg leading-9 text-zinc-200">
              ออกแบบพื้นที่ทำงานสะอาด เป็นระเบียบ แยกโซนรับงาน โซนลับคม
              โซนตรวจเช็ค และโซนจัดแสดงอุปกรณ์ เพื่อให้ลูกค้ามั่นใจในทุกขั้นตอน
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "เคาน์เตอร์รับงาน",
                "ผนังโชว์กรรไกร",
                "เครื่องลับคมบนโต๊ะ",
                "ตู้โชว์ปัตตาเลี่ยนและอุปกรณ์",
              ].map((item) => (
                <div
                  className="rounded-lg border border-amber-300/20 bg-black/40 px-4 py-3 text-base font-bold text-zinc-100"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40 sm:col-span-2">
              <img
                alt="ช่างกำลังตรวจและลับคมกรรไกรด้วยเครื่องมือเฉพาะทาง"
                className="h-72 w-full object-cover md:h-96"
                decoding="async"
                loading="lazy"
                src="/assets/technician-sharpening.webp"
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
              <img
                alt="เคาน์เตอร์รับงานภายในร้านลับคมโทนทองดำ"
                className="h-52 w-full object-cover object-[42%_58%]"
                decoding="async"
                loading="lazy"
                src="/assets/sharpening-studio-hero.webp"
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
              <img
                alt="ตู้โชว์สินค้าและอุปกรณ์ลับคมภายในร้าน"
                className="h-52 w-full object-cover object-right"
                decoding="async"
                loading="lazy"
                src="/assets/sharpening-studio-hero.webp"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Service Flow" title="ขั้นตอนการใช้บริการ" />
          <div className="grid gap-4 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <div
                className="relative rounded-lg border border-white/10 bg-zinc-950/70 p-5"
                key={step}
              >
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-amber-400 text-2xl font-black text-black">
                  {index + 1}
                </div>
                <p className="text-lg font-black leading-8 text-white">{step}</p>
                {index < processSteps.length - 1 ? (
                  <span className="absolute right-[-18px] top-12 hidden h-px w-9 bg-amber-300/70 md:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[linear-gradient(135deg,#15140f,#080806_56%,#171717)] px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Trust" title="ทำไมต้องลับคมกับช่างเจี๊ยบ" />
          <div className="grid gap-4 md:grid-cols-5">
            {trustItems.map((item) => (
              <div
                className="rounded-lg border border-amber-300/20 bg-black/40 p-5 text-center"
                key={item}
              >
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-amber-300 bg-amber-400/10 text-amber-300">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-base font-bold leading-8 text-zinc-100">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Real Works"
            title="ผลงานจริงจากร้าน แยกตามประเภทเครื่องมือ"
          >
            ภาพงานจริงจากลูกค้า แบ่งเป็นกรรไกร ปัตตาเลี่ยน มีด
            ใบเลื่อย ใบมีดวงกลม และเครื่องมือเฉพาะทางหลายประเภท
          </SectionTitle>

          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workGroups.map((group) => (
              <div
                className="rounded-lg border border-amber-300/20 bg-black/40 p-4"
                key={group.category}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-black leading-7 text-amber-200">
                    {group.category}
                  </h3>
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">
                    {group.items.length} รูป
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {group.description}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-12">
            {workGroups.map((group, groupIndex) => (
              <section
                aria-labelledby={`work-group-${groupIndex}`}
                className="border-t border-white/10 pt-8"
                key={group.category}
              >
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                      {group.items.length} Real Photos
                    </p>
                    <h3
                      className="mt-1 text-2xl font-black leading-tight text-white md:text-3xl"
                      id={`work-group-${groupIndex}`}
                    >
                      {group.category}
                    </h3>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-zinc-300 md:text-right">
                    {group.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item) => (
                    <figure
                      className="group overflow-hidden rounded-lg border border-white/10 bg-zinc-950"
                      key={`${group.category}-${item.title}`}
                    >
                      <img
                        alt={`${item.title} - ${group.category}`}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                        decoding="async"
                        loading="lazy"
                        src={item.image}
                      />
                      <figcaption className="border-t border-white/10 px-4 py-3">
                        <p className="text-sm font-bold text-amber-300">
                          {group.category}
                        </p>
                        <p className="mt-1 text-base font-black leading-7 text-white">
                          {item.title}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="border-y border-white/10 bg-[#10120e] px-4 py-16 md:px-6 md:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-amber-300/20 bg-black/50 p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
              Price Estimate
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
              สอบถามราคา
            </h2>
            <p className="mt-4 text-lg leading-9 text-zinc-200">
              ราคาขึ้นอยู่กับชนิดเครื่องมือและสภาพใบมีด
              ส่งรูปให้ช่างช่วยประเมินก่อนได้ก่อนนำเข้าร้าน
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-amber-400 px-6 font-black text-black transition hover:bg-amber-300"
                href={lineUrl}
              >
                <LineIcon />
                ส่งรูปเพื่อประเมินราคา
              </a>
              <a
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-amber-300/70 px-6 font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
                href={lineUrl}
              >
                สอบถามราคาทาง Line
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-[0_24px_60px_rgba(0,0,0,0.36)]">
            <h2 className="text-2xl font-black">เช็คสถานะงาน</h2>
            <p className="mb-4 mt-1 text-base leading-7 text-slate-600">
              กรอกรหัสงานบนใบรับงาน หรือสแกน QR Code บนใบรับงาน
            </p>
            <TrackLookupForm />
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_0.72fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-white md:text-5xl">
              ติดต่อร้านลับคมอุดรธานี By ช่างเจี๊ยบ
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <a
                className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 transition hover:border-amber-300/70"
                href={`tel:${mainPhone.replaceAll("-", "")}`}
              >
                <p className="text-sm font-bold text-amber-300">
                  โทร ช่างเจี๊ยบ
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  {mainPhone}
                </p>
              </a>
              <a
                className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 transition hover:border-amber-300/70"
                href={`tel:${secondPhone.replaceAll("-", "")}`}
              >
                <p className="text-sm font-bold text-amber-300">โทร ช่างเป็ด</p>
                <p className="mt-1 text-2xl font-black text-white">
                  {secondPhone}
                </p>
              </a>
            </div>
            <div className="mt-5 rounded-lg border border-white/10 bg-zinc-950/70 p-5">
              <p className="font-black text-amber-200">
                Facebook: ลับคมอุดรธานี by ช่างเจี๊ยบ
              </p>
              <p className="mt-3 leading-8 text-zinc-300">
                รุ่งจิรา กุลศิริ ลับคมอุดรธานี 254/4 ถนนอดุลยเดช
                ต.หมากแข้ง อ.เมือง จ.อุดรธานี 41000
              </p>
              <p className="mt-2 leading-8 text-zinc-300">
                ร้านอยู่มาทาง ร.ร ดอนบอส ถนนโลกีย์ ตรงข้าม CR7 สนุกเกอร์
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1877f2] px-5 font-black text-white"
                  href={facebookUrl}
                >
                  f
                  <span>Facebook</span>
                </a>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 font-black text-zinc-100 transition hover:border-amber-300 hover:text-amber-200"
                  href="/admin"
                >
                  สำหรับพนักงานร้าน
                </Link>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-amber-300/30 bg-black/60 p-5">
            <div className="rounded-lg bg-white p-3">
              <img
                alt="QR Code สำหรับเพิ่มเพื่อน Line ร้านลับคมอุดรธานี"
                className="aspect-square w-full"
                src={qrSrc}
              />
            </div>
            <p className="mt-4 text-center text-xl font-black text-amber-300">
              แอดไลน์สอบถามคิวและราคา
            </p>
            <p className="mt-2 text-center text-sm leading-6 text-zinc-300">
              ถ่ายรูปเครื่องมือ ส่งเข้ามาให้ช่างประเมินได้ทันที
            </p>
          </aside>
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
                By ช่างเจี๊ยบ - คมจริง ใช้งานดี
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#06c755] px-4 font-black text-white"
              href={lineUrl}
            >
              <LineIcon />
              Line
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-amber-400 px-4 font-black text-black"
              href={`tel:${mainPhone.replaceAll("-", "")}`}
            >
              <PhoneIcon />
              โทร
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1877f2] px-5 font-black text-white"
              href={facebookUrl}
            >
              Facebook
            </a>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-7xl text-sm text-zinc-500">
          © 2026 ลับคมอุดรธานี By ช่างเจี๊ยบ สงวนลิขสิทธิ์
        </p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-black/90 p-3 backdrop-blur md:hidden">
        <a
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#06c755] text-base font-black text-white"
          href={lineUrl}
        >
          <LineIcon />
          แอด Line
        </a>
        <a
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-amber-400 text-base font-black text-black"
          href={`tel:${mainPhone.replaceAll("-", "")}`}
        >
          <PhoneIcon />
          โทรร้าน
        </a>
      </div>
    </main>
  );
}
