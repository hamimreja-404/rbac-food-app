
const errorHandler = (err, req, res, next) => {
  console.error(` Error: ${err.message}`);
  console.error(err.stack); // Log the full stack trace for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = {
  errorHandler
};