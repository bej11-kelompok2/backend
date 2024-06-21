const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/seller.controller');
const upload = require('../util/multer')
const sellerController = new SellerController();

//rute seller
router.get('/seller/:id', sellerController.findById);
router.post('/seller/register', sellerController.create);
router.put('/seller/:id', sellerController.update);
router.delete('/seller/:id', sellerController.delete);
router.post('/seller/login', sellerController.login);

//rute item
router.post('/seller/:sellerId/item', upload.single('image'),sellerController.createItem);
router.get('/seller/:sellerId/items', sellerController.findAllItems);
router.get('/item/:itemId', sellerController.findItemById);

module.exports = router;