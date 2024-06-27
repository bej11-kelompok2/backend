const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const CartController = require("../controllers/cart.controller");
const cartController = new CartController();

router.get("/cart", authenticateToken, cartController.getUserCart);
router.post("/cart", authenticateToken, cartController.addItemToCart);
router.delete("/cart", authenticateToken, cartController.removeItemFromCart);

module.exports = router;
