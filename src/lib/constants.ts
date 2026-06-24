// ค่าคงที่ของระบบ — สถานะงาน และประเภทคม

export type JobStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "DONE"
  | "PICKED_UP"
  | "CANCELLED";

export const STATUS_ORDER: JobStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "DONE",
  "PICKED_UP",
  "CANCELLED",
];

export const STATUS_META: Record<
  JobStatus,
  { label: string; emoji: string; color: string; badge: string }
> = {
  PENDING: {
    label: "รอคิว",
    emoji: "🟡",
    color: "text-amber-700",
    badge: "bg-amber-400 text-black ring-1 ring-amber-600",
  },
  IN_PROGRESS: {
    label: "กำลังทำ",
    emoji: "🔵",
    color: "text-blue-700",
    badge: "bg-blue-600 text-white ring-1 ring-blue-800",
  },
  DONE: {
    label: "เสร็จแล้ว",
    emoji: "🟢",
    color: "text-green-700",
    badge: "bg-green-700 text-white ring-1 ring-green-900",
  },
  PICKED_UP: {
    label: "รับของแล้ว",
    emoji: "⚫",
    color: "text-slate-600",
    badge: "bg-slate-600 text-white ring-1 ring-slate-800",
  },
  CANCELLED: {
    label: "ยกเลิก",
    emoji: "❌",
    color: "text-red-700",
    badge: "bg-red-700 text-white ring-1 ring-red-900",
  },
};

// ประเภทคมที่รับลับ (แก้/เพิ่มได้)
export const ITEM_KINDS = [
  "กรรไกร",
  "ปัตตาเลี่ยน",
  "มีดแร่ปลา",
  "มีดทำครัว",
  "อื่นๆ",
] as const;

export function isValidStatus(s: string): s is JobStatus {
  return (STATUS_ORDER as string[]).includes(s);
}

export function statusLabel(s: string): string {
  return isValidStatus(s) ? STATUS_META[s].label : s;
}

// ปุ่มลัดประเภทคม + ราคาตั้งต้น (บาท/ชิ้น) — เจ้าของร้านแก้ราคาที่นี่ที่เดียว
// value = ค่าที่บันทึกลง JobItem.kind (ภาษาไทย ตรงกับ ITEM_KINDS — ไม่ต้อง migrate DB)
export type ItemPreset = {
  value: string;
  label: string;
  defaultPrice: number;
};

export const ITEM_PRESETS: ItemPreset[] = [
  { value: "กรรไกร", label: "กรรไกร", defaultPrice: 50 },
  { value: "ปัตตาเลี่ยน", label: "ปัตตาเลี่ยน", defaultPrice: 80 },
  { value: "มีดแร่ปลา", label: "มีดแร่ปลา", defaultPrice: 40 },
  { value: "มีดทำครัว", label: "มีดทำครัว", defaultPrice: 40 },
  { value: "อื่นๆ", label: "อื่นๆ", defaultPrice: 0 },
];

// แตะปุ่มลัด → สร้างแถวรายการเริ่มต้น
export const presetToRow = (p: ItemPreset) => ({
  kind: p.value,
  description: "",
  quantity: 1,
  unitPrice: p.defaultPrice,
});
