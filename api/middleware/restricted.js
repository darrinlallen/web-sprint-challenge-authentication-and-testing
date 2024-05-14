module.exports = (req, res, next) => {
  next();
  /*
    IMPLEMENT
random
    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".
dddd
    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */const jwt = require('jsonwebtoken') // npm install

const { JWT_SECRET } = require('../../config')

// AUTHENTICATION
const restricted = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next({ status: 401, message: "You can't touch this!" })
      } else {
        req.decodedJwt = decodedToken
        console.log('decoded token', req.decodedJwt)

        next()
      }
    })
  } else {
    next({ status: 401, message: 'You shall not pass!' })
  }
}

// AUTHORIZATION
const checkRole = role => (req, res, next) => {
  // make sure the roles property is in the token's payload and that the desired role is present
  if (req.decodedJwt.role && req.decodedJwt.role === role) {
    next()
  } else {
    // return a 403 Forbidden, the user is logged in, but has no access
    next({ status: 403, message: "You have no power here!" })
  }
}

module.exports = {
  restricted,
  checkRole,
}

};
