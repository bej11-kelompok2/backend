const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const OrderController = require("../controllers/order.controller");
const orderController = new OrderController();

router.post("/order/", authenticateToken, orderController.createOrder);
router.get("/order/", authenticateToken, orderController.getOrdersByUserId);
router.put("/order/pay/:orderId", authenticateToken, orderController.payOrder);
router.put(
  "/order/sent/:orderId",
  authenticateToken,
  orderController.sentOrder
);
router.put(
  "/order/delivered/:orderId",
  authenticateToken,
  orderController.deliveredOrder
);
router.put(
  "/order/cancel/:orderId",
  authenticateToken,
  orderController.cancelOrder
);

module.exports = router;
