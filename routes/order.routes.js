const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const OrderController = require("../controllers/order.controller");
const orderController = new OrderController();

router.post("/order/", authenticateToken, orderController.createOrder);
router.get("/order/", authenticateToken, orderController.getOrdersByUserId);
router.patch("/order/pay/:orderId", orderController.payOrder);
router.patch("/order/sent/:orderId", orderController.sentOrder);
router.patch("/order/delivered/:orderId", orderController.deliveredOrder);
router.patch("/order/cancel/:orderId", orderController.cancelOrder);

module.exports = router;
