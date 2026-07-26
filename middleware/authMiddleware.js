const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check if the Authorization header is present and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the actual token string from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the secret key
      // decoded is the payload of the token, which contains user information name,id etc not password
      const decoded = jwt.verify(token, 'MY_SUPER_SECRET_KEY_123');

      // 4. Attach the decoded user data to the request object
      req.user = decoded;

      // 5. Proceed to the next function/controller!
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. If no token was found in the request, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };