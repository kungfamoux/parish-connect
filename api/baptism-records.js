const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

// Prisma client
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = Math.min(parseInt(limit), 100); // Max 100 records
    const skip = (parsedPage - 1) * parsedLimit;

    // Build search conditions
    const where = search ? {
      OR: [
        { baptismName: { contains: search, mode: 'insensitive' } },
        { surname: { contains: search, mode: 'insensitive' } },
        { otherName: { contains: search, mode: 'insensitive' } },
        { sNo: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    // Get total count
    const total = await prisma.baptismRecord.count({ where });

    // Get records with pagination
    const records = await prisma.baptismRecord.findMany({
      where,
      skip,
      take: parsedLimit,
      orderBy: { sNo: 'asc' },
    });

    res.status(200).json({
      records,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
};
