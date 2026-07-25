// Import the User Mongoose model to perform database operations
const User = require('../models/User');

// Import bcryptjs library for hashing sensitive user passwords
const bcrypt = require('bcryptjs');

// Controller function to handle new user registration
const registerUser = async (req, res) => {
  try {
    // Extract user inputs sent from the frontend/Postman inside the request body
    const { name, email, password, role } = req.body;

    // Search the database to check if a user with this email already exists
    const existingUser = await User.findOne({ email });

    // If email is found, stop execution and return a 400 Bad Request response
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate a random salt string with complexity level of 10
    const salt = await bcrypt.genSalt(10);

    // Hash the raw password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user record into MongoDB database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student', // Default role to 'student' if not provided
    });

    // Send a 201 Created response with user details (excluding password)
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
    // Handle any internal server or database errors
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Export the function so it can be used inside the routes file
module.exports = { registerUser };