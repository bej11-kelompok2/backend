const { Order, OrderItem, Cart, CartItem, sequelize } = require("../models");
const logger = require("../util/logger");

class OrderRepository {
  async createOrder(userId, total_price, address, cartId) {
    try {
      const order = await Order.create({
        user_id: userId,
        total_price: total_price,
        address: address,
        cart_id: cartId,
        status: "PENDING",
      });
      return order;
    } catch (error) {
      throw new Error("Error creating order");
    }
  }

  async createOrderItem(orderId, cartId) {
    const transaction = await sequelize.transaction();
    try {
      const cartItems = await CartItem.findAll({
        where: {
          cart_id: cartId,
        },
      });

      for (const cartItem of cartItems) {
        await OrderItem.create(
          {
            order_id: orderId,
            item_id: cartItem.item_id,
            quantity: cartItem.quantity,
          },
          { transaction }
        );
      }

      await CartItem.destroy(
        {
          where: {
            cart_id: cartId,
          },
        },
        { transaction }
      );

      await Cart.destroy(
        {
          where: {
            id: cartId,
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      logger.error("Error creating order item");
      throw new Error("Error creating order item");
    }
  }

  async getOrdersByUserId(userId) {
    try {
      const orders = await Order.findAll({
        where: {
          user_id: userId,
        },
      });
      return orders;
    } catch (error) {
      throw new Error("Error getting orders");
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findByPk(orderId);
      order.status = status;
      await order.save();
      return order;
    } catch (error) {
      throw new Error("Error updating order status");
    }
  }
}
module.exports = OrderRepository;
