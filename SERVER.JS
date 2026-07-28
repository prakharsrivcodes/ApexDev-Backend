// Load environment variables at the VERY TOP before any other code executes
require('dotenv').config();

// Import required external npm packages
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');

// Import security hardening middlewares
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// Initialize the primary Express application instance
const app = express();

// Apply Helmet middleware to set secure HTTP headers and mask server metadata
// its used for security hardening to protect against common web vulnerabilities like XSS, clickjacking, and MIME sniffing attacks. It also helps to prevent information disclosure by hiding server details in HTTP response headers.
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS) to allow frontend connections
app.use(cors());

// Middleware to automatically parse incoming HTTP requests with JSON payloads
app.use(express.json());

// Sanitize request body, query parameters, and URL params against NoSQL query injection used after json parsing middleware to prevent malicious MongoDB operators from being injected into queries

// app.use(mongoSanitize());

// Configure IP-based rate limiting policy to prevent DDoS and brute-force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute time window
  max: 100, // Limit each IP address to a maximum of 100 requests per window
  message: {
    status: 429,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in standard HTTP headers
  legacyHeaders: false, // Disable legacy 'X-RateLimit-*' headers
});

// Apply rate limiting middleware to all endpoints under '/api'
app.use('/api', apiLimiter);

// Import the authentication router module
const authRoutes = require('./routes/auth');
const errorMiddleware = require('./middleware/errorMiddleware');

// Mount all authentication endpoints under the '/api/auth' base path
app.use('/api/auth', authRoutes);

// Define a root testing route to verify server status
app.get('/', (req, res) => {
  res.send('ApexDev IS LIVE');
});

// Connect to local MongoDB server using environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Database Successfully Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Set server port and start listening for incoming network requests
app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});