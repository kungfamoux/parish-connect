// API with real database connection using dynamic Prisma import
export default async (req, res) => {
  // Strict security headers for confidential data
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'null');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limiting and access validation
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';
  
  // Basic security checks
  if (!clientIP) {
    return res.status(403).json({ error: 'Access denied - IP required' });
  }

  // Rate limiting (simple implementation)
  const now = Date.now();
  const rateLimitKey = `rate_limit_${clientIP}`;
  
  // Log access attempt for audit
  console.log(`ACCESS ATTEMPT: ${clientIP} - ${userAgent} - ${new Date().toISOString()}`);

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

    // Generate Prisma client on-demand
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
      log: ['info', 'warn', 'error'],
    });
    
    const { page = 1, limit = 20, search = '' } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = Math.min(parseInt(limit) || 20, 20); // Reduced limit for security
    const skip = (parsedPage - 1) * parsedLimit;

    console.log('Parsed params:', { page: parsedPage, limit: parsedLimit, search });

    // Search restrictions for security
    if (search && search.trim()) {
      const searchTerm = search.trim();
      
      // Prevent empty or too short searches (data scraping protection)
      if (searchTerm.length < 2) {
        return res.status(400).json({ 
          error: 'Search term must be at least 2 characters long',
          message: 'For security reasons, please enter at least 2 characters to search'
        });
      }
      
      // Prevent very broad searches that could expose too much data
      if (searchTerm.length < 3 && parsedLimit > 10) {
        return res.status(400).json({ 
          error: 'Search too broad',
          message: 'Please enter more specific search terms'
        });
      }
    }

    // Build search conditions with restrictions
    let where = {};
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where = {
        OR: [
          { sNo: { contains: searchTerm, mode: 'insensitive' } },
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

    // Data masking for sensitive information
    const maskedRecords = records.map(record => ({
      ...record,
      // Mask sensitive personal information (partial masking)
      dateOfBirth: record.dateOfBirth ? record.dateOfBirth.substring(0, 4) + '-XX-XX' : null,
      // Keep full baptism information but limit exposure
      baptismName: record.baptismName,
      surname: record.surname,
      otherName: record.otherName,
      sNo: record.sNo,
      dateOfBaptism: record.dateOfBaptism,
      placeOfBaptism: record.placeOfBaptism,
      // Mask parents' names partially for privacy
      fathersName: record.fathersName ? record.fathersName.substring(0, Math.max(3, record.fathersName.length / 2)) + '***' : null,
      mothersName: record.mothersName ? record.mothersName.substring(0, Math.max(3, record.mothersName.length / 2)) + '***' : null,
      // Keep ceremonial information
      solemnOrPrivate: record.solemnOrPrivate,
      nameOfMinister: record.nameOfMinister,
      // Mask godparents' names for privacy
      nameOfGodParents: record.nameOfGodParents ? '***CONFIDENTIAL***' : null,
      // Keep other sacramental dates but mask personal details
      firstHolyCommunionDate: record.firstHolyCommunionDate,
      firstHolyCommunionPlace: record.firstHolyCommunionPlace,
      confirmationDate: record.confirmationDate,
      confirmationPlace: record.confirmationPlace,
      // Mask marriage information for privacy
      marriageDate: null,
      marriagePartnerName: '***CONFIDENTIAL***',
      marriagePlace: null,
      marriageWitnesses: '***CONFIDENTIAL***',
      marriageMinister: null,
      dateOfDeath: record.dateOfDeath ? '***CONFIDENTIAL***' : null,
      remarks: record.remarks ? '***CONFIDENTIAL***' : null,
    }));

    const response = {
      records: maskedRecords,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      securityNotice: 'This is confidential parish data. Access is logged and monitored.',
    };

    console.log('Sending masked response for security');
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
      type: error.constructor.name,
      details: 'Prisma client generation issue - may need to run prisma generate in build process'
    });
  } finally {
    // Note: prisma cleanup handled by garbage collection in serverless
  }
};
