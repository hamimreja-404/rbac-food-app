/**
 * Global Error Handler Middleware
 * Formats all backend errors into a consistent JSON structure.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  console.error(err.stack); // Log the full stack trace for debugging

  // Default to 500 Internal Server Error if a status code wasn't already set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    // Only show the detailed stack trace if we are in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = {
  errorHandler
};