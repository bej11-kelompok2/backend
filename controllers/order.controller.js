const OrderService = require('../usecase/order.service');
const BaseResponse = require('../util/base.response');


class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req, res) => {
    try {
      const userId = req.params.userId
      const order = await this.orderService.createOrder(userId);
      res.status(201).json(new BaseResponse(true, 'Order created', order));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  }

  getOrdersByUserId = async (req, res) => {
    try {
      const userId = req.params.userId;
      const orders = await this.orderService.getOrdersByUserId(userId);
      res.status(200).json(new BaseResponse(true, 'Orders found', orders));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  }

  payOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const status = 'PAID';
      const order = await this.orderService.updateOrderStatus(orderId, status);
      res.status(200).json(new BaseResponse(true, 'Order updated', order));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  }

  sentOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const status = 'ON DELIVERY';
      const order = await this.orderService.updateOrderStatus(orderId, status);
      res.status(200).json(new BaseResponse(true, 'Order updated', order));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  }

  deliveredOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const status = 'DELIVERED';
      const order = await this.orderService.updateOrderStatus(orderId, status);
      res.status(200).json(new BaseResponse(true, 'Order updated', order));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  }

  cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const status = 'CANCELLED';
      const order = await this.orderService.updateOrderStatus(orderId, status);
      res.status(200).json(new BaseResponse(true, 'Order updated', order));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  }
}

module.exports = OrderController
