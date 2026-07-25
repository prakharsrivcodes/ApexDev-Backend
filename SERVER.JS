// Import required external npm packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the primary Express application instance
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) to allow frontend connections
app.use(cors());

// Middleware to automatically parse incoming HTTP requests with JSON payloads
app.use(express.json());

// Import the authentication router module
const authRoutes = require('./routes/auth');

// Mount all authentication endpoints under the '/api/auth' base path
app.use('/api/auth', authRoutes);

// Define a root testing route to verify server status
app.get('/', (req, res) => {
  res.send('ApexDev IS LIVE');
});

// Define local MongoDB connection URL string
const MONGO_URI = 'mongodb://127.0.0.1:27017/apexdev';

// Establish connection with local MongoDB server
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Database Successfully Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Set server port and start listening for incoming network requests
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
})