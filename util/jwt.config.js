const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const generateVerifyToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const verifyToken = (token) => {
  data = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    return decoded.userId;
  });

  return data;
};

module.exports = {
  generateToken,
  verifyToken,
  generateVerifyToken,
};
