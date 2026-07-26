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

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // password is one i gave by hash it became more secure and encrypted

    // Save user to DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
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
    // This token acts like a digital ID card for the user.
    const token = jwt.sign(
      { id: user._id, role: user.role }, //data inside token payload
      'MY_SUPER_SECRET_KEY_123', // Secret key used to sign and encrypt the token
      { expiresIn: '1d' }         // Token will automatically expire in 1 day one of option is to use env variable for secret key instead of hardcoding it
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

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by the protect middleware after token verification
    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// Update module exports at the bottom of controllers/authController.js
module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};