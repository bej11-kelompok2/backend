const CartService = require("./cart.service");
const CartRepository = require("../repository/cart.repository");
const UserRepository = require("../repository/user.repository");

jest.mock("../repository/cart.repository");
jest.mock("../repository/user.repository");

describe("CartService", () => {
  let cartService;

  beforeEach(() => {
    CartRepository.mockClear();
    UserRepository.mockClear();
    cartService = new CartService();
  });

  describe("userCart", () => {
    it("should return the user's cart", async () => {
      const userId = 1;
      const cart = { id: 1, userId };
      const userCart = { id: 1, items: [] };

      cartService.cartRepository.findByUserId.mockResolvedValue(cart);
      cartService.cartRepository.userCart.mockResolvedValue(userCart);

      const result = await cartService.userCart(userId);

      expect(result).toEqual(userCart);
      expect(cartService.cartRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
      expect(cartService.cartRepository.userCart).toHaveBeenCalledWith(cart.id);
    });
  });

  describe("addItemToCart", () => {
    it("should add an item to the user's cart", async () => {
      const userId = 1;
      const itemId = 1;
      const quantity = 2;
      const user = { id: userId };
      const cart = { id: 1, userId };

      cartService.userRepository.findById.mockResolvedValue(user);
      cartService.cartRepository.findByUserId.mockResolvedValue(cart);
      cartService.cartRepository.addItemToCart.mockResolvedValue(true);

      const result = await cartService.addItemToCart(userId, itemId, quantity);

      expect(result).toEqual(true);
      expect(cartService.userRepository.findById).toHaveBeenCalledWith(userId);
      expect(cartService.cartRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
      expect(cartService.cartRepository.addItemToCart).toHaveBeenCalledWith(
        cart.id,
        itemId,
        quantity
      );
    });

    it("should throw an error if the user is not found", async () => {
      const userId = 1;
      const itemId = 1;
      const quantity = 2;

      cartService.userRepository.findById.mockResolvedValue(null);

      await expect(
        cartService.addItemToCart(userId, itemId, quantity)
      ).rejects.toThrow("User not found");
    });
  });

  describe("removeItemFromCart", () => {
    it("should remove an item from the user's cart", async () => {
      const userId = 1;
      const itemId = 1;
      const quantity = 1;
      const user = { id: userId };
      const cart = { id: 1, userId };

      cartService.userRepository.findById.mockResolvedValue(user);
      cartService.cartRepository.findByUserId.mockResolvedValue(cart);
      cartService.cartRepository.removeItemFromCart.mockResolvedValue(true);

      const result = await cartService.removeItemFromCart(
        userId,
        itemId,
        quantity
      );

      expect(result).toEqual(true);
      expect(cartService.userRepository.findById).toHaveBeenCalledWith(userId);
      expect(cartService.cartRepository.findByUserId).toHaveBeenCalledWith(
        userId
      );
      expect(
        cartService.cartRepository.removeItemFromCart
      ).toHaveBeenCalledWith(cart.id, itemId, quantity);
    });

    it("should throw an error if the user is not found", async () => {
      const userId = 1;
      const itemId = 1;
      const quantity = 1;

      cartService.userRepository.findById.mockResolvedValue(null);

      await expect(
        cartService.removeItemFromCart(userId, itemId, quantity)
      ).rejects.toThrow("User not found");
    });
  });
});
