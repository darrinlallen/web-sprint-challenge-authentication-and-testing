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
router.post('/register', restrictMe, (req, res, next) => {
  const { username, password } = req.body;

  // Check if the username already exists in the users table
  Users.findBy({ username }).then(existingUser => {
    if (existingUser) {
      // If the username exists, respond with a "username taken" message
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password asynchronously
    bcrypt.hash(password, 8, (err, hash) => {
      if (err) {
        return next(err);
      }

      const newUser = { username, password: hash };

      // Add user to the database
      Users.add(newUser)
        .then(savedUser => {
          // Respond with the saved user
          res.status(201).json(savedUser);
        })
        .catch(next);
    });
  }).catch(next);
});

// Route handler for user login
router.post('/login', (req, res, next) => {
  let { username, password } = req.body;

  // Retrieve the user from the database based on the provided username
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
            // If username doesn't exist or password is incorrect
            return res.status(401).json({ message: 'Invalid credentials' });
          }
          
          // Session saved, cookie set on client
          req.session.user = user;
          res.status(200).json({ message: `Welcome, ${user.username}` });
        });
      } else {
        // If username doesn't exist
        res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch(next);
});

module.exports = router;
