const OrderService = require("./order.service");
const OrderRepository = require("../repository/order.repository");
const CartRepository = require("../repository/cart.repository");
const logger = require("../util/logger");

jest.mock("../repository/order.repository");
jest.mock("../repository/cart.repository");
jest.mock("../util/logger");

describe("OrderService", () => {
  let orderService;

  beforeEach(() => {
    OrderRepository.mockClear();
    CartRepository.mockClear();
    orderService = new OrderService();
  });

  describe("createOrder", () => {
    it("should create an order successfully", async () => {
      const userId = 1;
      const user = { id: userId };
      const cart = {
        id: 1,
        CartItems: [
          { Item: { price: 100 }, quantity: 2 },
          { Item: { price: 200 }, quantity: 1 },
        ],
      };
      const order = { id: 1, userId, total_price: 400 };

      orderService.cartRepository.findByUserId.mockResolvedValue(user);
      orderService.cartRepository.userCart.mockResolvedValue(cart);
      orderService.orderRepository.createOrder.mockResolvedValue(order);
      orderService.orderRepository.createOrderItem.mockResolvedValue(true);

      const result = await orderService.createOrder(userId);

      expect(result).toEqual(order);
      expect(orderService.orderRepository.createOrder).toHaveBeenCalledWith(
        userId,
        400
      );
      expect(orderService.orderRepository.createOrderItem).toHaveBeenCalledWith(
        order.id,
        cart.id
      );
    });

    it("should throw an error if user is not found", async () => {
      const userId = 1;
      orderService.cartRepository.findByUserId.mockResolvedValue(null);

      await expect(orderService.createOrder(userId)).rejects.toThrow(
        "User not found"
      );
    });

    it("should throw an error if cart is empty", async () => {
      const userId = 1;
      const user = { id: userId };
      const cart = { id: 1, CartItems: [] };

      orderService.cartRepository.findByUserId.mockResolvedValue(user);
      orderService.cartRepository.userCart.mockResolvedValue(cart);

      await expect(orderService.createOrder(userId)).rejects.toThrow(
        "Cart is empty"
      );
    });

    it("should log and throw an error if there is an error creating the order", async () => {
      const userId = 1;
      const user = { id: userId };
      const cart = {
        id: 1,
        CartItems: [
          { Item: { price: 100 }, quantity: 2 },
          { Item: { price: 200 }, quantity: 1 },
        ],
      };

      orderService.cartRepository.findByUserId.mockResolvedValue(user);
      orderService.cartRepository.userCart.mockResolvedValue(cart);
      orderService.orderRepository.createOrder.mockRejectedValue(
        new Error("Error creating order")
      );

      await expect(orderService.createOrder(userId)).rejects.toThrow(
        "Error creating order"
      );
      expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getOrdersByUserId", () => {
    it("should return orders for a user", async () => {
      const userId = 1;
      const orders = [
        { id: 1, userId },
        { id: 2, userId },
      ];

      orderService.orderRepository.getOrdersByUserId.mockResolvedValue(orders);

      const result = await orderService.getOrdersByUserId(userId);

      expect(result).toEqual(orders);
      expect(
        orderService.orderRepository.getOrdersByUserId
      ).toHaveBeenCalledWith(userId);
    });

    it("should log and throw an error if there is an error getting orders", async () => {
      const userId = 1;
      orderService.orderRepository.getOrdersByUserId.mockRejectedValue(
        new Error("Error getting orders")
      );

      await expect(orderService.getOrdersByUserId(userId)).rejects.toThrow(
        "Error getting orders"
      );
      expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status successfully", async () => {
      const orderId = 1;
      const status = "shipped";

      orderService.orderRepository.updateOrderStatus.mockResolvedValue(true);

      const result = await orderService.updateOrderStatus(orderId, status);

      expect(result).toEqual(true);
      expect(
        orderService.orderRepository.updateOrderStatus
      ).toHaveBeenCalledWith(orderId, status);
    });

    it("should throw an error if there is an error updating order status", async () => {
      const orderId = 1;
      const status = "shipped";

      orderService.orderRepository.updateOrderStatus.mockRejectedValue(
        new Error("Error updating order status")
      );

      await expect(
        orderService.updateOrderStatus(orderId, status)
      ).rejects.toThrow("Error updating order status");
    });
  });
});
