const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');

// Helper function — generates a random 6-digit OTP as a string
const generateOtp = () => {
  // Math.random() gives a decimal between 0 and 1
  // multiplying by 900000 and adding 100000 ensures a 6-digit number (100000 - 999999)
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

// 1. REGISTER USER CONTROLLER 
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists with this email', 400));
  }

  // Generate OTP and set it to expire in 10 minutes from now
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // current time + 10 minutes

  const newUser = await User.create({
    name,
    email,
    password,
    role: role || 'jobSeeker',
    otp,
    otpExpiry,
    isVerified: false, 
  });

  // Send the OTP via email
  await sendEmail(
    newUser.email,
    'Verify your ApexDev account',
    `Your OTP is: ${otp}. It will expire in 10 minutes.`
  );

  res.status(201).json({
    message: 'Registration successful! Please check your email for the OTP to verify your account.',
    userId: newUser._id, // frontend will need this to submit the OTP verification request
  });
});

// NEW — 2. VERIFY OTP CONTROLLER
const verifyOtp = asyncHandler(async (req, res, next) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (user.isVerified) {
    return next(new ErrorHandler('User is already verified', 400));
  }

  if (user.otp !== otp) {
    return next(new ErrorHandler('Invalid OTP', 400));
  }

  if (user.otpExpiry < new Date()) {
    return next(new ErrorHandler('OTP has expired. Please request a new one.', 400));
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({
    message: 'Email verified successfully! You can now log in.',
  });
});

// 3. LOGIN USER CONTROLLER 
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('Invalid credentials (User not found)', 400));
  }


  if (!user.isVerified) {
    return next(new ErrorHandler('Please verify your email before logging in.', 403));
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

// 4. GET USER PROFILE CONTROLLER 
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
  verifyOtp, 
  loginUser,
  getUserProfile,
};