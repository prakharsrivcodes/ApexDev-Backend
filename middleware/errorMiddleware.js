const ErrorHandler = require('../utils/errorHandler');

// Global Centralized Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
  // Read statusCode from our ErrorHandler box, fallback to 500
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // 1. Invalid MongoDB ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // 2. Duplicate Key Error (e.g., Email already registered in DB)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // 3. Invalid JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token is invalid. Try again!';
    err = new ErrorHandler(message, 401);
  }

  // 4. Expired JWT Error
  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token is expired. Try again!';
    err = new ErrorHandler(message, 401);
  }

  // Send the clean JSON response to client
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // Stack trace visible only in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorMiddleware