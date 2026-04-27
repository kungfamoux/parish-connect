// Response utility functions
export const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString()
});

export const errorResponse = (message, code = 500, details = null) => ({
  success: false,
  error: message,
  code,
  details,
  timestamp: new Date().toISOString()
});

export const paginatedResponse = (data, total, page, limit, message = 'Success') => ({
  success: true,
  message,
  data,
  pagination: {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  },
  timestamp: new Date().toISOString()
});
