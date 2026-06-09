// Database connection middleware
export const withDatabase = (handler) => async (req, res) => {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      error: 'Database configuration error',
      message: 'DATABASE_URL environment variable is not set'
    });
  }

  let prisma;
  try {
    // Initialize Prisma client with accelerate extension
    const { PrismaClient } = await import('@prisma/client');
    const { withAccelerate } = await import('@prisma/extension-accelerate');
    
    prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
      log: ['info', 'warn', 'error'],
    }).$extends(withAccelerate());

    await prisma.$connect();

    // Add prisma instance to request for use in handler
    req.prisma = prisma;

    // Call the handler
    const result = await handler(req, res);

    return result;
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      message: 'Unable to connect to the database'
    });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
};
