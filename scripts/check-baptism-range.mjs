import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

config({ path: '.env' });

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function run() {
  const total = await prisma.baptismRecord.count();
  const minMax = await prisma.baptismRecord.aggregate({
    _min: { sNo: true },
    _max: { sNo: true },
  });

  const serialRows = await prisma.baptismRecord.findMany({
    select: { sNo: true },
    where: { sNo: { gte: 1, lte: 8466 } },
    orderBy: { sNo: 'asc' },
  });

  const serialSet = new Set(serialRows.map((row) => row.sNo).filter((value) => value !== null));
  const missing = [];

  for (let i = 1; i <= 8466; i++) {
    if (!serialSet.has(i)) missing.push(i);
  }

  console.log(
    JSON.stringify(
      {
        total,
        minSNo: minMax._min.sNo,
        maxSNo: minMax._max.sNo,
        inRangeRows: serialRows.length,
        missingCount: missing.length,
        firstMissing20: missing.slice(0, 20),
      },
      null,
      2
    )
  );
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
