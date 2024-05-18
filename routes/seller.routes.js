const express = require('express');
const router = express.Router();

const SellerController = require('../controllers/seller.controller');
const sellerController = new SellerController();

router.get('/seller/:id', sellerController.findById);
router.post('/seller/register', sellerController.create);
router.put('/seller/:id', sellerController.update);
router.delete('/seller/:id', sellerController.delete);
router.post('/seller/login', sellerController.login);
router.post('/seller/:sellerId/item', sellerController.createItem);
router.get('/seller/:sellerId/item/:itemId', sellerController.findItemById);
router.get('/seller/:sellerId/items', sellerController.findAllItems);

module.exports = router;
