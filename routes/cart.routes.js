const express = require('express');
const router = express.Router();

const CartController = require('../controllers/cart.controller');
const cartController = new CartController();

router.get('/cart/:userId', cartController.getUserCart);
router.post('/cart/:userId', cartController.addItemToCart);
router.delete('/cart/:userId', cartController.removeItemFromCart);

module.exports = router;
