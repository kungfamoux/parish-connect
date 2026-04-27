// API for Parish Pastoral Council members
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

  try {
    console.log('=== Pastoral Council API Request ===');
    console.log('Method:', req.method);
    console.log('Database URL exists:', !!process.env.DATABASE_URL);

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'Database configuration error',
        message: 'DATABASE_URL environment variable is not set in Vercel'
      });
    }

    // Initialize Prisma client
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
      log: ['info', 'warn', 'error'],
    });

    try {
      await prisma.$connect();
      console.log('Database connected successfully');

      if (req.method === 'GET') {
        // Get all pastoral council members
        const members = await prisma.parishPastoralCouncil.findMany({
          orderBy: { sNo: 'asc' }
        });
        console.log('Found members:', members.length);

        res.status(200).json({
          members,
          total: members.length
        });
      } else if (req.method === 'POST') {
        // Add initial members if table is empty
        const existingCount = await prisma.parishPastoralCouncil.count();
        
        if (existingCount === 0) {
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

          console.log('Inserted members:', result.count);

          res.status(201).json({
            message: 'Pastoral council members initialized successfully',
            inserted: result.count
          });
        } else {
          res.status(200).json({
            message: 'Pastoral council members already exist',
            count: existingCount
          });
        }
      }

    } finally {
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('=== Pastoral Council API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.constructor.name
    });
  }
};
