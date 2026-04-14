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

  let prisma;
  
  try {
    // Initialize Prisma client
    prisma = new PrismaClient();
    
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');

    // Test basic connection
    await prisma.$connect();
    console.log('Connected to database successfully');

    // Check if table exists
    try {
      const count = await prisma.baptismRecord.count();
      console.log('Table exists, record count:', count);
      
      // Get first 5 records as test
      const records = await prisma.baptismRecord.findMany({
        take: 5,
        orderBy: { sNo: 'asc' }
      });
      
      res.status(200).json({
        success: true,
        message: 'Database connection successful',
        totalRecords: count,
        sampleRecords: records
      });

    } catch (tableError) {
      console.error('Table error:', tableError);
      res.status(500).json({
        success: false,
        error: 'Table does not exist',
        message: tableError.message
      });
    }

  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database connection failed',
      message: error.message 
    });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};
