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
        EXTRACT(YEAR FROM "DATE_OF_BAPTISM") as year,
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "DATE_OF_BAPTISM" IS NOT NULL 
        AND "BAPTISM_NAME" IS NOT NULL 
        AND "SURNAME" IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM "DATE_OF_BAPTISM")
      ORDER BY year DESC
      LIMIT 10
    `;

    // Get records by month for current year
    const currentYear = new Date().getFullYear();
    const recordsByMonth = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "DATE_OF_BAPTISM") as month,
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "DATE_OF_BAPTISM" IS NOT NULL 
        AND EXTRACT(YEAR FROM "DATE_OF_BAPTISM") = ${currentYear}
        AND "BAPTISM_NAME" IS NOT NULL 
        AND "SURNAME" IS NOT NULL
      GROUP BY EXTRACT(MONTH FROM "DATE_OF_BAPTISM")
      ORDER BY month
    `;

    // Get solemn vs private statistics
    const ceremonyTypeStats = await prisma.$queryRaw`
      SELECT 
        "SOLEMN_OR_PRIVATE",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "SOLEMN_OR_PRIVATE" IS NOT NULL
        AND "BAPTISM_NAME" IS NOT NULL 
        AND "SURNAME" IS NOT NULL
      GROUP BY "SOLEMN_OR_PRIVATE"
    `;

    // Get top home towns
    const topHomeTowns = await prisma.$queryRaw`
      SELECT 
        "HOME_TOWN",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "HOME_TOWN" IS NOT NULL 
        AND "HOME_TOWN" != ''
        AND "BAPTISM_NAME" IS NOT NULL 
        AND "SURNAME" IS NOT NULL
      GROUP BY "HOME_TOWN"
      ORDER BY count DESC
      LIMIT 10
    `;

    // Get top baptism places
    const topBaptismPlaces = await prisma.$queryRaw`
      SELECT 
        "PLACE_OF_BAPTISM",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "PLACE_OF_BAPTISM" IS NOT NULL 
        AND "PLACE_OF_BAPTISM" != ''
        AND "BAPTISM_NAME" IS NOT NULL 
        AND "SURNAME" IS NOT NULL
      GROUP BY "PLACE_OF_BAPTISM"
      ORDER BY count DESC
      LIMIT 10
    `;

    // Get recent trends (last 6 months)
    const recentTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "DATE_OF_BAPTISM") as month,
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "DATE_OF_BAPTISM" >= NOW() - INTERVAL '6 months'
        AND "DATE_OF_BAPTISM" IS NOT NULL
        AND "BAPTISM_NAME" IS NOT NULL 
        AND "SURNAME" IS NOT NULL
      GROUP BY DATE_TRUNC('month', "DATE_OF_BAPTISM")
      ORDER BY month DESC
    `;

    // Get minister statistics
    const ministerStats = await prisma.$queryRaw`
      SELECT 
        "NAME_OF_MINISTER",
        COUNT(*) as count
      FROM "baptism_records" 
      WHERE "NAME_OF_MINISTER" IS NOT NULL 
        AND "NAME_OF_MINISTER" != ''
        AND "BAPTISM_NAME" IS NOT NULL 
        AND "SURNAME" IS NOT NULL
      GROUP BY "NAME_OF_MINISTER"
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
      topHomeTown: topHomeTowns.length > 0 ? topHomeTowns[0].HOME_TOWN : 'N/A',
      topBaptismPlace: topBaptismPlaces.length > 0 ? topBaptismPlaces[0].PLACE_OF_BAPTISM : 'N/A',
      solemnBaptisms: ceremonyTypeStats.find(s => s.SOLEMN_OR_PRIVATE === 'SOLEMN')?.count || 0,
      privateBaptisms: ceremonyTypeStats.find(s => s.SOLEMN_OR_PRIVATE === 'PRIVATE')?.count || 0,
    };

    const response = {
      success: true,
      data: {
        overview: demographics,
        recordsByYear: recordsByYear.map(r => ({ year: Number(r.year), count: Number(r.count) })),
        recordsByMonth: recordsByMonth.map(r => ({ month: Number(r.month), count: Number(r.count) })),
        ceremonyTypeStats: ceremonyTypeStats.map(s => ({ type: s.SOLEMN_OR_PRIVATE, count: Number(s.count) })),
        topHomeTowns: topHomeTowns.map(t => ({ homeTown: t.HOME_TOWN, count: Number(t.count) })),
        topBaptismPlaces: topBaptismPlaces.map(p => ({ place: p.PLACE_OF_BAPTISM, count: Number(p.count) })),
        recentTrends: recentTrends.map(t => ({ 
          month: new Date(t.month).toISOString(), 
          count: Number(t.count) 
        })),
        ministerStats: ministerStats.map(m => ({ minister: m.NAME_OF_MINISTER, count: Number(m.count) })),
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
