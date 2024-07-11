const OrderRepository = require("../repository/order.repository");
const CartRepository = require("../repository/cart.repository");
const logger = require("../util/logger");

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.cartRepository = new CartRepository();
  }

  async createOrder(userId) {
    try {
      const user = await this.cartRepository.findByUserId(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const cart = await this.cartRepository.userCart(user.id);
      if (!cart || cart.CartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Calculate total price
      let total_price = 0;
      cart.CartItems.forEach((item) => {
        total_price += item.Item.price * item.quantity;
      });

      const order = await this.orderRepository.createOrder(userId, total_price);
      await this.orderRepository.createOrderItem(order.id, cart.id);
      return order;
    } catch (error) {
      logger.error(error);
      throw error; // Rethrow the original error to preserve its message
    }
  }

  async getOrdersByUserId(userId) {
    try {
      const orders = await this.orderRepository.getOrdersByUserId(userId);
      return orders;
    } catch (error) {
      logger.error(error);
      throw new Error("Error getting orders");
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      return await this.orderRepository.updateOrderStatus(orderId, status);
    } catch (error) {
      throw new Error("Error updating order status");
    }
  }
}

module.exports = OrderService;
