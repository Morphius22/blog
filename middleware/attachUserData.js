const jwt = require("jsonwebtoken");

function attachUserData(req, res, next) {
  const token = req.cookies.jwt;
  console.log("Token:", token); // Debug: log the token

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.secret);
      res.locals.user = decoded;
      console.log("User data:", decoded); // Debug: log the user data
    } catch (error) {
      // Invalid token, do nothing
      console.log("Invalid token:", error); // Debug: log the error
    }
  }

  next();
}

module.exports = attachUserData;
