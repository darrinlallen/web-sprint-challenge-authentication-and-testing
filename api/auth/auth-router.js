
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const Users = require('./users-model.js');

// Middleware to check if username and password are provided
const restrictMe = (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Perform validation or checks here
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // If validation passes, call next() to pass control to the next middleware/route handler
    next();
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    next(error);
  }
};

// Route handler for user registration
router.post('/register', restrictMe, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists in the users table
    const existingUser = await Users.findBy({ username });
    if (existingUser) {
      // If the username exists, respond with a "username taken" message
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password asynchronously
    const hash = await bcrypt.hash(password, 8);
    const newUser = { username, password: hash };

    // Add user to the database
    const savedUser = await Users.add(newUser);

    // Respond with the saved user
    res.status(201).json(savedUser);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

// Route handler for user login
router.post('/login', async (req, res, next) => {
  try {
    let { username, password } = req.body;

    const user = await Users.findBy({ username }).first();

    if (user && bcrypt.compareSync(password, user.password)) {
      // Session saved, cookie set on client
      req.session.user = user;
      return res.status(200).json({ message: `Welcome, ${user.username}` });
    }

    // If username doesn't exist or password is incorrect
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

module.exports = router;
