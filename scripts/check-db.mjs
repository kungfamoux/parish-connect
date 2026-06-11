import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { config } from 'dotenv';

config({ path: '.env' });

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function checkDb() {
  try {
    console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.slice(0, 50) + '...');

    const total = await prisma.baptismRecord.count();
    console.log('Total baptism records in DB:', total);

    if (total > 0) {
      const sample = await prisma.baptismRecord.findMany({ take: 3, orderBy: { sNo: 'asc' } });
      console.log('Sample records:');
      sample.forEach(r => console.log(` - sNo: ${r.sNo}, name: ${r.baptismName} ${r.surname}`));
    } else {
      console.log('No records found in the database.');
    }
  } catch (err) {
    console.error('DB error:', err.message);
    console.error('Full error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
