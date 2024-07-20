const { body } = require("express-validator");

const createItemValidation = [
  body("name").isString().isLength({ min: 5 }),
  body("price").isNumeric(),
  body("stock").isNumeric(),
  body("description").isString().isLength({ min: 10 }),
];

module.exports = {
  createItemValidation,
};
