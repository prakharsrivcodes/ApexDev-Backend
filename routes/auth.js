// Import Express framework to create a sub-router instance
const express = require('express');
const router = express.Router();

// Import authentication controller functions
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/authController');

// Import authentication middleware for token verification
const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected endpoints (Requires valid JWT token in Authorization header)
router.get('/profile', protect, getUserProfile);

// Export router instance for mounting in server.js
module.exports = router;