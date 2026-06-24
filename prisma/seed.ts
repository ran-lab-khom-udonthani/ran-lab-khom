import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ล้างข้อมูลเดิม (เฉพาะตอน seed)
  await prisma.job.deleteMany();

  await prisma.job.create({
    data: {
      code: "KH-DEMO",
      customerName: "คุณสมชาย ใจดี",
      customerPhone: "081-234-5678",
      status: "PENDING",
      note: "ลับด่วน นัดรับพรุ่งนี้",
      totalPrice: 250,
      items: {
        create: [
          { kind: "กรรไกร", description: "กรรไกรตัดผม Jaguar", quantity: 1, unitPrice: 150 },
          { kind: "ปัตตาเลี่ยน", description: "Wahl ใบมีด", quantity: 1, unitPrice: 100 },
        ],
      },
    },
  });

  await prisma.job.create({
    data: {
      code: "KH-FISH",
      customerName: "ร้านปลาเจ๊หมวย",
      customerPhone: "089-999-8888",
      status: "IN_PROGRESS",
      totalPrice: 360,
      items: {
        create: [
          { kind: "มีดแร่ปลา", description: "มีดแร่ปลานิล", quantity: 3, unitPrice: 80 },
          { kind: "มีดทำครัว", quantity: 2, unitPrice: 60 },
        ],
      },
    },
  });

  await prisma.job.create({
    data: {
      code: "KH-DONE",
      customerName: "คุณวิภา",
      status: "DONE",
      paid: true,
      doneAt: new Date(),
      totalPrice: 120,
      items: {
        create: [{ kind: "กรรไกร", quantity: 1, unitPrice: 120 }],
      },
    },
  });

  console.log("✅ seed ข้อมูลตัวอย่างเรียบร้อย (รหัส: KH-DEMO, KH-FISH, KH-DONE)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
