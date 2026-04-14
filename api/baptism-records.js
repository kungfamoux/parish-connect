const { PrismaClient } = require('@prisma/client');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let prisma;
  
  try {
    // Initialize Prisma client with direct URL
    prisma = new PrismaClient();
    
    const { page = 1, limit = 20, search = '' } = req.query;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build search conditions - simplified to avoid crashes
    let where = {};
    if (search && search.trim()) {
      where = {
        OR: [
          { baptismName: { contains: search.trim(), mode: 'insensitive' } },
          { surname: { contains: search.trim(), mode: 'insensitive' } },
          { otherName: { contains: search.trim(), mode: 'insensitive' } },
        ],
      };
    }

    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
    console.log('Search term:', search);
    console.log('Where clause:', JSON.stringify(where));

    // Get total count
    const total = await prisma.baptismRecord.count({ where });

    // Get records with pagination
    const records = await prisma.baptismRecord.findMany({
      where,
      skip,
      take: parsedLimit,
      orderBy: { sNo: 'asc' },
    });

    console.log('Found records:', records.length);
    console.log('Total count:', total);

    res.status(200).json({
      records,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    });

  } catch (error) {
    console.error('API Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};
