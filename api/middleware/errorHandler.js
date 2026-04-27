// Error handling middleware
export const errorHandler = (error, req, res) => {
  console.error('API Error:', error);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  // Handle specific error types
  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database request error';
    details = error.message;
  } else if (error.name === 'PrismaClientUnknownRequestError') {
    statusCode = 500;
    message = 'Database connection error';
  } else if (error.code === 'P2002') {
    statusCode = 409;
    message = 'Unique constraint violation';
    details = 'A record with this information already exists';
  } else if (error.message) {
    message = error.message;
  }

  res.status(statusCode).json({
    error: message,
    message: details || message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};
