const router = require('express').Router();
const jokes = require('./jokes-data');

// Token verification middleware
const verifyToken = (req, res, next) => {
  // Check if the request contains a valid token
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  // Here, you would implement your logic to verify the token
  // For example, you can use a JWT library to decode and verify the token
  // Assume verifyToken(token) is a function that validates the token

  if (!verifyToken(token)) {
    return res.status(401).json({ message: 'token invalid' });
  }

  // If the token is valid, call next() to pass control to the next middleware/route handler
  next();
};

// Apply token verification middleware to restrict access
router.get('/', verifyToken, (req, res) => {
  res.status(200).json(jokes);
});

module.exports = router;

