const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  verifyOtp,    
  loginUser, 
  getUserProfile 
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp); 
router.post('/login', loginUser);

// Protected endpoints (Requires valid JWT token in Authorization header)
router.get('/profile', protect, getUserProfile);

module.exports = router;