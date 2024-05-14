const restrictMe = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    // Create an error object and pass it to next()
    const error = new Error('Username and password are required');
    error.status = 400; // Set status code for bad request
    return next(error); // Pass control to error handling middleware
  } else {
    // Call next() to proceed to the next middleware in the chain
    next();
  }
};

module.exports = restrictMe;
