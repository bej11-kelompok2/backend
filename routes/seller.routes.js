const express = require("express");
const router = express.Router();
const SellerController = require("../controllers/seller.controller");
const upload = require("../util/multer");
const authenticateToken = require("../middleware/authenticateToken");
const sellerController = new SellerController();

//rute seller
router.get("/seller/:id", sellerController.findById);
router.put("/seller", authenticateToken, sellerController.update);
router.delete("/seller", authenticateToken, sellerController.delete);

//rute item
router.post(
  "/seller/item",
  authenticateToken,
  upload.single("image"),
  sellerController.createItem
);
router.get("/seller/:sellerId/items", sellerController.findAllItems);
router.get("/item/:itemId", sellerController.findItemById);

module.exports = router;
