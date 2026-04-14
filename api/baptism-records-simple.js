export default async (req, res) => {
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

  try {
    console.log('=== SIMPLE API TEST ===');
    console.log('Request method:', req.method);
    console.log('Request query:', req.query);
    console.log('Environment DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');

    const { page = 1, limit = 20, search = '' } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);

    // Return mock data for testing
    const mockRecords = [
      {
        id: 1,
        sNo: "001",
        baptismName: "John",
        surname: "Doe",
        dateOfBaptism: "2023-01-15T00:00:00.000Z",
        placeOfBaptism: "St. Mary Parish"
      },
      {
        id: 2,
        sNo: "002", 
        baptismName: "Jane",
        surname: "Smith",
        dateOfBaptism: "2023-02-20T00:00:00.000Z",
        placeOfBaptism: "St. Mary Parish"
      }
    ];

    const response = {
      records: mockRecords,
      total: mockRecords.length,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(mockRecords.length / parsedLimit),
    };

    console.log('Returning mock response:', JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error('Simple API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
