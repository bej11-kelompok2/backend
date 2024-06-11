const CartRepository = require('../repository/cart.repository');
const UserRepository = require('../repository/user.repository');

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.userRepository = new UserRepository();
  }

  async userCart(userId) {
    const cart = await this.cartRepository.findByUserId(userId);
    return await this.cartRepository.userCart(cart.id);
  }

  async addItemToCart(userId, itemId, quantity) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const cart = await this.cartRepository.findByUserId(userId);
    return await this.cartRepository.addItemToCart(cart.id, itemId, quantity);
  }

  async removeItemFromCart(userId, itemId, quantity) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const cart = await this.cartRepository.findByUserId(userId);
    return await this.cartRepository.removeItemFromCart(cart.id, itemId, quantity);
  }
}

module.exports = CartService;
