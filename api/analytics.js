// Analytics API for baptismal records statistics and insights
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

  try {
    console.log('=== Analytics API Request ===');
    console.log('Method:', req.method);
    console.log('Query:', req.query);

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'Database configuration error',
        message: 'DATABASE_URL environment variable is not set'
      });
    }

    // Generate Prisma client on-demand
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
      log: ['info', 'warn', 'error'],
    });

    // Test database connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');

    const { type = 'overview', year, month } = req.query;

    // Get total records count
    const totalRecords = await prisma.baptismRecord.count({
      where: {
        baptismName: { not: null },
        surname: { not: null }
      }
    });

    // Get records by year
    const recordsByYear = await prisma.$queryRaw`
      SELECT 
        EXTRACT(YEAR FROM "dateOfBaptism") as year,
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "dateOfBaptism" IS NOT NULL 
        AND "baptismName" IS NOT NULL 
        AND "surname" IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM "dateOfBaptism")
      ORDER BY year DESC
      LIMIT 10
    `;

    // Get records by month for current year
    const currentYear = new Date().getFullYear();
    const recordsByMonth = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "dateOfBaptism") as month,
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "dateOfBaptism" IS NOT NULL 
        AND EXTRACT(YEAR FROM "dateOfBaptism") = ${currentYear}
        AND "baptismName" IS NOT NULL 
        AND "surname" IS NOT NULL
      GROUP BY EXTRACT(MONTH FROM "dateOfBaptism")
      ORDER BY month
    `;

    // Get solemn vs private statistics
    const ceremonyTypeStats = await prisma.$queryRaw`
      SELECT 
        "solemnOrPrivate",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "solemnOrPrivate" IS NOT NULL
        AND "baptismName" IS NOT NULL 
        AND "surname" IS NOT NULL
      GROUP BY "solemnOrPrivate"
    `;

    // Get top home towns
    const topHomeTowns = await prisma.$queryRaw`
      SELECT 
        "homeTown",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "homeTown" IS NOT NULL 
        AND "homeTown" != ''
        AND "baptismName" IS NOT NULL 
        AND "surname" IS NOT NULL
      GROUP BY "homeTown"
      ORDER BY count DESC
      LIMIT 10
    `;

    // Get top baptism places
    const topBaptismPlaces = await prisma.$queryRaw`
      SELECT 
        "placeOfBaptism",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "placeOfBaptism" IS NOT NULL 
        AND "placeOfBaptism" != ''
        AND "baptismName" IS NOT NULL 
        AND "surname" IS NOT NULL
      GROUP BY "placeOfBaptism"
      ORDER BY count DESC
      LIMIT 10
    `;

    // Get recent trends (last 6 months)
    const recentTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "dateOfBaptism") as month,
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "dateOfBaptism" >= NOW() - INTERVAL '6 months'
        AND "dateOfBaptism" IS NOT NULL
        AND "baptismName" IS NOT NULL 
        AND "surname" IS NOT NULL
      GROUP BY DATE_TRUNC('month', "dateOfBaptism")
      ORDER BY month DESC
    `;

    // Get minister statistics
    const ministerStats = await prisma.$queryRaw`
      SELECT 
        "nameOfMinister",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "nameOfMinister" IS NOT NULL 
        AND "nameOfMinister" != ''
        AND "baptismName" IS NOT NULL 
        AND "surname" IS NOT NULL
      GROUP BY "nameOfMinister"
      ORDER BY count DESC
      LIMIT 10
    `;

    // Get demographic insights
    const demographics = {
      totalRecords,
      averagePerYear: recordsByYear.length > 0 
        ? Math.round(recordsByYear.reduce((sum, year) => sum + Number(year.count), 0) / recordsByYear.length)
        : 0,
      currentYearTotal: recordsByMonth.reduce((sum, month) => sum + Number(month.count), 0),
      topHomeTown: topHomeTowns.length > 0 ? topHomeTowns[0].homeTown : 'N/A',
      topBaptismPlace: topBaptismPlaces.length > 0 ? topBaptismPlaces[0].placeOfBaptism : 'N/A',
      solemnBaptisms: ceremonyTypeStats.find(s => s.solemnOrPrivate === 'SOLEMN')?.count || 0,
      privateBaptisms: ceremonyTypeStats.find(s => s.solemnOrPrivate === 'PRIVATE')?.count || 0,
    };

    const response = {
      success: true,
      data: {
        overview: demographics,
        recordsByYear: recordsByYear.map(r => ({ year: Number(r.year), count: Number(r.count) })),
        recordsByMonth: recordsByMonth.map(r => ({ month: Number(r.month), count: Number(r.count) })),
        ceremonyTypeStats: ceremonyTypeStats.map(s => ({ type: s.solemnOrPrivate, count: Number(s.count) })),
        topHomeTowns: topHomeTowns.map(t => ({ homeTown: t.homeTown, count: Number(t.count) })),
        topBaptismPlaces: topBaptismPlaces.map(p => ({ place: p.placeOfBaptism, count: Number(p.count) })),
        recentTrends: recentTrends.map(t => ({ 
          month: new Date(t.month).toISOString(), 
          count: Number(t.count) 
        })),
        ministerStats: ministerStats.map(m => ({ minister: m.nameOfMinister, count: Number(m.count) })),
      }
    };

    console.log('Analytics data generated successfully');
    res.status(200).json(response);

  } catch (error) {
    console.error('=== Analytics API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.constructor.name
    });
  }
};
