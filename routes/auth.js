// Import Express framework to create a sub-router instance
const express = require('express');
const router = express.Router();

// Import the specific controller function for registration logic
const { registerUser } = require('../controllers/authController');

// Define a POST endpoint for '/register' and attach the registerUser controller logic
router.post('/register', registerUser);

// Export the configured router to be mounted in server.js
module.exports = router;