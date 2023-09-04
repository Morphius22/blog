const jwt = require("jsonwebtoken");

function attachUserData(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.secret);
      res.locals.user = decoded;
    } catch (error) {
      // Invalid token, do nothing
    }
  }

  next();
}

module.exports = attachUserData;
