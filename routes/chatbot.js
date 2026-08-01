const express = require('express');
const router = express.Router();

const { checkJobOfferText } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// Any logged-in user (jobSeeker especially) can use this — no role restriction
router.post('/check', protect, checkJobOfferText);

module.exports = router;