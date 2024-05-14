const restricted = (req, res, next) => {
  if (!req.username || !req.password) {
    return `username and password required`
  } else {
    next({ status: 401, message: 'You shall not pass!' })
  }
}

module.exports = {
  restricted,
}