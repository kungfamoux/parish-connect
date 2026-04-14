import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env' });

// Prisma client
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

// API Routes
app.get('/api/baptism-records', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';

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

    res.json({
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching baptism records:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
