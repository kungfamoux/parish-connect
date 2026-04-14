import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  accelerateUrl: import.meta.env.VITE_DATABASE_URL,
}).$extends(withAccelerate());

export { prisma };

export async function fetchBaptismRecords(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const search = params.search || '';

    const skip = (page - 1) * limit;

    // Build search conditions
    const where = search ? {
      OR: [
        { baptismName: { contains: search, mode: 'insensitive' as const } },
        { surname: { contains: search, mode: 'insensitive' as const } },
        { otherName: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    // Add serial number search if it's a number
    if (search && /^\d+$/.test(search)) {
      const sNo = parseInt(search);
      if (where.OR) {
        (where.OR as any).push({ sNo });
      }
    }

    // Get total count
    const total = await prisma.baptismRecord.count({ where });

    // Get records with pagination
    const records = await prisma.baptismRecord.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { sNo: 'asc' },
        { dateOfBaptism: 'desc' }
      ]
    });

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching baptism records:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
