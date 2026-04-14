// API with real database connection using dynamic Prisma import
export default async (req, res) => {
  // Set CORS headers first
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
    console.log('=== API Request ===');
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    console.log('Database URL exists:', !!process.env.DATABASE_URL);

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'Database configuration error',
        message: 'DATABASE_URL environment variable is not set in Vercel'
      });
    }

    // Initialize Prisma client dynamically
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    
    const { page = 1, limit = 20, search = '' } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const skip = (parsedPage - 1) * parsedLimit;

    console.log('Parsed params:', { page: parsedPage, limit: parsedLimit, search });

    // Build search conditions
    let where = {};
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where = {
        OR: [
          { baptismName: { contains: searchTerm, mode: 'insensitive' } },
          { surname: { contains: searchTerm, mode: 'insensitive' } },
          { otherName: { contains: searchTerm, mode: 'insensitive' } },
          { fathersName: { contains: searchTerm, mode: 'insensitive' } },
          { mothersName: { contains: searchTerm, mode: 'insensitive' } },
        ],
      };
      console.log('Search where clause:', JSON.stringify(where));
    }

    // Test database connection first
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');

    // Get total count
    console.log('Executing count query...');
    const total = await prisma.baptismRecord.count({ where });
    console.log('Count result:', total);

    // Get records with pagination
    console.log('Executing findMany query...');
    const records = await prisma.baptismRecord.findMany({
      where,
      skip,
      take: parsedLimit,
      orderBy: { sNo: 'asc' },
    });
    console.log('Records found:', records.length);

    const response = {
      records,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    };

    console.log('Sending response:', JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.constructor.name
    });
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect();
        console.log('Database disconnected');
      } catch (disconnectError) {
        console.error('Disconnect error:', disconnectError);
      }
    }
  }
};
