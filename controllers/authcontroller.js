// Import the User model to perform database queries
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// NAYA IMPORT — yeh missing tha
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');

// 1. REGISTER USER CONTROLLER
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists with this email', 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: role || 'student',
  });

  res.status(201).json({
    message: 'User registered successfully!',
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// 2. LOGIN USER CONTROLLER
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('Invalid credentials (User not found)', 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid credentials (Wrong password)', 400));
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    message: 'Login successful!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 3. GET USER PROFILE CONTROLLER
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    return next(new ErrorHandler('User not found in database', 404));
  }

  res.status(200).json({
    message: 'Profile retrieved successfully',
    user: user,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};