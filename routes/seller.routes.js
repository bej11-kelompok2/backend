const express = require("express");
const router = express.Router();
const SellerController = require("../controllers/seller.controller");
const upload = require("../util/multer");
const authenticateToken = require("../middleware/authenticateToken");
const { createItemValidation } = require("../middleware/seller.validation");
const sellerController = new SellerController();

//rute seller
router.get("/seller/:id", sellerController.findById);
router.put("/seller", authenticateToken, sellerController.update);
router.delete("/seller", authenticateToken, sellerController.delete);

//rute item
router.post(
  "/seller/item",
  authenticateToken,
  upload.single("image"), // Move this before validation
  createItemValidation,
  sellerController.createItem
);
router.get("/seller/:sellerId/items", sellerController.findAllItemsById);
router.get("/items", sellerController.findAllItems);
router.get("/item/:itemId", sellerController.findItemById);
router.put("/item/:itemId", authenticateToken, sellerController.updateItem);
router.delete("/item/:itemId", authenticateToken, sellerController.deleteItem);

module.exports = router;
