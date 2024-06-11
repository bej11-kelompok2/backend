const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = {
  generateToken,
  verifyToken
};
