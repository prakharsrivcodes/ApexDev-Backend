// Import the User model to perform database queries
const User = require('../models/User');

// Import bcryptjs to compare plain text passwords with hashed passwords
const bcrypt = require('bcryptjs');

// Import jsonwebtoken to create secure authentication tokens for logged-in users
const jwt = require('jsonwebtoken');

// 1. REGISTER USER CONTROLLER

const registerUser = async (req, res) => {
  try {
    // Extract inputs sent from body
    const { name, email, password, role } = req.body;

    // Check if email already exists in DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Save user to DB (Mongoose handles password securely)
    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    // Success response
    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};


// 2. LOGIN USER CONTROLLER

const loginUser = async (req, res) => {
  try {
    // Step A: Grab the email and password entered by the user in Postman/Frontend
    const { email, password } = req.body;

    // Step B: Search MongoDB for a user with this email
    const user = await User.findOne({ email });

    // Step C: If no user found with this email, stop and return 400 Error
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (User not found)' });
    }

    // Step D: Compare the plain password entered by user with the hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password);

    // Step E: If passwords do not match, stop and return 400 Error
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (Wrong password)' });
    }

    // Step F: Password matched! Create a JWT Token containing user's unique ID and role.
    const token = jwt.sign(
      { id: user._id, role: user.role }, // data inside token payload
      process.env.JWT_SECRET,           // Secret key strictly loaded from .env
      { expiresIn: '1d' }               // Token automatically expires in 1 day
    );

    // Step G: Send 200 OK response back with the generated token and user details
    res.status(200).json({
      message: 'Login successful!',
      token, // Frontend will save this token to keep the user logged in
      user: {
        id: user._id,
        name: user.name,  
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Catch any unexpected crash or database server error
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// 3. GET USER PROFILE CONTROLLER
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // Fetch fresh user data from database using ID from token payload, excluding hashed password field
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching profile', error: error.message });
  }
};

// Update module exports at the bottom of controllers/authController.js
module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};