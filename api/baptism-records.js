// Simple API without Prisma for now
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
    console.log('=== API Request ===');
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    console.log('Database URL exists:', !!process.env.DATABASE_URL);

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'Database configuration error',
        message: 'DATABASE_URL environment variable is not set in Vercel. Please add it in Vercel dashboard.'
      });
    }

    // Return mock data for now since DATABASE_URL is not set
    const mockRecords = [
      {
        id: 1,
        sNo: "001",
        baptismName: "John",
        surname: "Doe",
        dateOfBaptism: "2023-01-15T00:00:00.000Z",
        placeOfBaptism: "St. Mary Parish",
        fathersName: "John Doe Sr.",
        mothersName: "Jane Doe"
      },
      {
        id: 2,
        sNo: "002", 
        baptismName: "Jane",
        surname: "Smith",
        dateOfBaptism: "2023-02-20T00:00:00.000Z",
        placeOfBaptism: "St. Mary Parish",
        fathersName: "Robert Smith",
        mothersName: "Mary Smith"
      },
      {
        id: 3,
        sNo: "003",
        baptismName: "Michael",
        surname: "Johnson",
        dateOfBaptism: "2023-03-10T00:00:00.000Z",
        placeOfBaptism: "St. Mary Parish",
        fathersName: "David Johnson",
        mothersName: "Sarah Johnson"
      }
    ];

    const { page = 1, limit = 20, search = '' } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);

    console.log('Parsed params:', { page: parsedPage, limit: parsedLimit, search });

    // Filter mock data based on search
    let filteredRecords = mockRecords;
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredRecords = mockRecords.filter(record => 
        record.baptismName?.toLowerCase().includes(searchTerm) ||
        record.surname?.toLowerCase().includes(searchTerm) ||
        record.fathersName?.toLowerCase().includes(searchTerm) ||
        record.mothersName?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = startIndex + parsedLimit;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    const response = {
      records: paginatedRecords,
      total: filteredRecords.length,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(filteredRecords.length / parsedLimit),
    };

    console.log('Sending response:', JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.constructor.name
    });
  }
};
