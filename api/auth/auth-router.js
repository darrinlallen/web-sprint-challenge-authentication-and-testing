const bcrypt = require('bcryptjs');
const router = require('express').Router();
const restrictMe = require('../middleware/restricted.js')
const Users = require('./users-model.js')

// for endpoints beginning with /api/auth
router.post('/register', restrictMe,  (req, res, next) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 8) // 2 ^ n
  user.password = hash

  Users.add(user)
    .then(saved => {
      res.status(201).json({saved})
    })
    .catch(next) // our custom err handling middleware will trap this
})

// for endpoints beginning with /api/auth
router.post('/register', restrictMe, (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({ saved });
    })
    .catch(error => {
      // Check if the error is related to a duplicate username
      if (error.message.includes('duplicate key value violates unique constraint')) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      // If it's another type of error, pass it to the error handling middleware
      next(error);
    });
});


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
