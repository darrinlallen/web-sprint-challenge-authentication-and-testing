const bcrypt = require('bcryptjs');
const router = require('express').Router();
const restrictMe = require('../middleware/restricted.js')
const Users = require('./users-model.js')

// for endpoints beginning with /api/auth
router.post('/register', async (req, res, next) => {
  try {
    // Call restrictMe middleware
    restrictMe(req, res, async () => {
      // This function is called when restrictMe middleware calls next()
      // Now you're back in the route handler
      const user = req.body;
      const hash = await bcrypt.hash(user.password, 8); // Hash the password asynchronously
      user.password = hash;

      // Add user to the database
      const savedUser = await Users.add(user);

      // Respond with the saved user
      res.status(201).json(savedUser);
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});


router.post('/login', (req, res, next) => {
  let { username, password } = req.body

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // this is the critical line. Session saved, cookie set on client:
        req.session.user = user
        res.status(200).json({
          message: `welcome, ${user.username}`})
      } else {
        next({ status: 401, message: 'Invalid Credentials' })
      }
    })
    .catch(next)
})

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */


module.exports = router;
