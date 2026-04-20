// API with real database connection - Prisma client generation fix
export default async (req, res) => {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Handle POST request for initializing pastoral council data
  if (req.method === 'POST') {
    let prisma;
    try {
      // Initialize Prisma client
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prisma.$connect();

      const councilMembers = [
        { sNo: 1, name: "Very Rev. Msgr. A. Anijielo", zone: null, position: "Parish Priest Chairman" },
        { sNo: 2, name: "Rev. Fr. Chinoso Odoh", zone: null, position: "Vicar Member" },
        { sNo: 3, name: "Dr Ifendu Ohabuike", zone: null, position: "DDL Member" },
        { sNo: 4, name: "Mr Paul Agu", zone: "Zone 12", position: "1st Vice Chairman" },
        { sNo: 5, name: "Chief (Sir) O.O. Apiakason", zone: "Zone 1", position: "2nd Vice Chairman" },
        { sNo: 6, name: "Dr Ifeanyi Ugwu", zone: "Zone 8", position: "Secretary" },
        { sNo: 7, name: "Mrs Rose Ozodiegwu", zone: "Zone 7", position: "Asst. Secretary" },
        { sNo: 8, name: "Chief Mrs. J. I. Obi", zone: "Zone 11", position: "Fin. Secretary" },
        { sNo: 9, name: "Amb. Paulinus Eze", zone: "Zone 3", position: "Treasurer" },
        { sNo: 10, name: "Mr Emmanuel Chime", zone: "Zone 13", position: "P.R.O" }
      ];

      const result = await prisma.parishPastoralCouncil.createMany({
        data: councilMembers,
        skipDuplicates: true,
      });

      console.log('Inserted pastoral council members:', result.count);

      res.status(201).json({
        message: 'Pastoral council members initialized successfully',
        inserted: result.count
      });

    } catch (error) {
      console.error('Pastoral council initialization error:', error);
      res.status(500).json({ 
        error: 'Failed to initialize pastoral council',
        message: error.message
      });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }
    return;
  }

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
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const skip = (parsedPage - 1) * parsedLimit;

    console.log('Parsed params:', { page: parsedPage, limit: parsedLimit, search });

    // Build search conditions
    let where = {};
    if (search && search.trim()) {
      const searchTerm = search.trim();
      
      // Only search if term is reasonable (not too short or just special characters)
      if (searchTerm.length >= 2 && /^[a-zA-Z0-9\s]+$/.test(searchTerm)) {
        where = {
          OR: [
            { baptismName: { contains: searchTerm, mode: 'insensitive' } },
            { surname: { contains: searchTerm, mode: 'insensitive' } },
            { otherName: { contains: searchTerm, mode: 'insensitive' } },
            { fathersName: { contains: searchTerm, mode: 'insensitive' } },
            { mothersName: { contains: searchTerm, mode: 'insensitive' } },
          ],
        };
        
        // Try to add serial number search if it's a pure number
        if (/^\d+$/.test(searchTerm)) {
          where.OR.push({ sNo: parseInt(searchTerm) });
        }
        
        console.log('Search where clause:', JSON.stringify(where));
      } else {
        console.log('Search term too short or contains invalid characters:', searchTerm);
      }
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
      type: error.constructor.name,
      details: 'Prisma client generation issue - may need to run prisma generate in build process'
    });
  } finally {
    // Note: prisma cleanup handled by garbage collection in serverless
  }
};
