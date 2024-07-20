const { body } = require("express-validator");

const createItemValidation = [
  body("seller").custom((value, { req }) => {
    console.log("Received seller value:", value); // Debug log
    console.log("Received request body:", req.body); // Debug log

    let sellerData;

    // First, check if the value is already an object
    if (typeof value === "object" && value !== null) {
      sellerData = value;
    } else {
      // If it's a string, try to parse it as JSON
      try {
        sellerData = JSON.parse(value);
      } catch (error) {
        console.error("JSON parse error:", error); // Debug log
        throw new Error(
          `Invalid JSON format for seller data: ${error.message}`
        );
      }
    }

    // Now check each field
    if (!sellerData.name || typeof sellerData.name !== "string") {
      throw new Error("Name is required and must be a string");
    }

    if (!sellerData.description || typeof sellerData.description !== "string") {
      throw new Error("Description is required and must be a string");
    }

    if (!sellerData.price || isNaN(Number(sellerData.price))) {
      throw new Error("Price is required and must be a valid number");
    }

    if (!Number.isInteger(sellerData.stock) || sellerData.stock < 0) {
      throw new Error("Stock must be a non-negative integer");
    }

    // If all checks pass, attach the parsed data to the request for later use
    req.body.parsedSeller = sellerData;

    return true;
  }),
];

module.exports = {
  createItemValidation,
};
