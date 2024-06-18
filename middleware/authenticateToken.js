const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the header
  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token is present
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    // Initialize `req.user` and store user data decoded from the token
    req.user = {
      id: decoded.userId,
      // You can add more user details here if needed
    };

    next(); // Proceed to next middleware or route handler
  });
};

module.exports = authenticateToken;
