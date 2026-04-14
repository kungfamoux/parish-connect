module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('=== BASIC TEST ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);

    // Very simple response
    const response = {
      success: true,
      message: 'Basic API test working',
      timestamp: new Date().toISOString(),
      environment: {
        node_version: process.version,
        platform: process.platform,
        database_url_set: !!process.env.DATABASE_URL
      }
    };

    console.log('Sending response:', JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error('Basic test error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
