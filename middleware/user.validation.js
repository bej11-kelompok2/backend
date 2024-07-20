const { body } = require("express-validator");

const createUserValidation = [
  body("username").isString().notEmpty(),
  body("email").isEmail().notEmpty(),
  body("password").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("phone_number").isString().notEmpty(),
  body("gender").isString().notEmpty(),
  body("role").isString().notEmpty(),
];

const loginUserValidation = [
  body("email").isEmail().notEmpty(),
  body("password").isString().notEmpty(),
];

module.exports = {
  createUserValidation,
  loginUserValidation,
};
