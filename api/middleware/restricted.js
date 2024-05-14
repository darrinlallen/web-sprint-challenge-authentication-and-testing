const restricted = (req, res, next) => {
  if (!req.username || !req.password) {
    return `username and password required`
  } 
}

module.exports = {
  restricted,
}