const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Token is valid, proceed with the request
    return true
  } catch (error) {
    // Token verification failed, handle the error
    console.error('Token verification failed:', error.message);
    // Respond with an appropriate error message
    return false
  }
  
};

module.exports = verifyToken;
const restrict = (req, res, next) => {
  try {
    // Check if the request contains a valid token
    const token = req.headers.authorization;

    // If there is no token, respond with a 401 status and a message stating that a token is required
    if (!token) {
      return res.status(401).json({ message: 'token required' });
    }

    // Here, you would implement your logic to verify the token
    // For example, you can use a JWT library to decode and verify the token
    // Assume verifyToken(token) is a function that validates the token

    if (!verifyToken(token)) {
      // If the token is invalid, respond with a 401 status and a message indicating that the token is invalid
      return res.status(401).json({ message: 'token invalid' });
    }

    // If the token is valid, call next() to pass control to the next middleware/route handler
    next();
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    next(error);
  }
};

module.exports = restrict;