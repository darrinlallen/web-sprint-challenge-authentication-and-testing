const bcrypt = require('bcryptjs');
const router = require('express').Router();
const Users = require('./users-model.js');
const jwt = require('jsonwebtoken');

// Route handler for user registration
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the username already exists in the users table
    /*const existingUser = await Users.findBy({ username });
    if (existingUser) {
      // If the username exists, respond with a "username taken" message
      return res.status(400).json({ message: 'Username already taken' });
    }
*/
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
// Route handler for user login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Retrieve the user from the database based on the provided username
    const user = await Users.findBy({ username }).first();
    if (!user) {
      // If username doesn't exist
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // If password is incorrect
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If username and password are correct, generate JWT token
   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the JWT token in the response
    res.status(200).json({ message: 'Login successful'});
    
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

module.exports = router;
