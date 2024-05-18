const { Cart, CartItem, Item } = require('../models');


class CartRepository {
  async findByUserId(userId) {
    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });

      if (!cart) {
        return await Cart.create({ user_id: userId });
      }

      return cart;
    }
    catch (error) {
      console.log(error);
      throw new Error('Error fetching user cart');
    }
  }

  async userCart(cartId) {
    try {
      const cart = await Cart.findOne({
        where: { id: cartId },
        include: {
          model: CartItem,
          include: Item,
        },
      });

      return cart;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching user cart items');
    }
  }

  async addItemToCart(cartId, itemId, quantity) {
    try {
      const item = await Item.findByPk(itemId);
      if (!item) {
        throw new Error('Item not found');
      }
      const cartItem = await CartItem.findOne({ where: { cart_id: cartId, item_id: itemId } });
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await CartItem.create({ cart_id: cartId, item_id: itemId, quantity });
      }
    }
    catch (error) {
      throw new Error('Error adding item to cart');
    }
  }

  async removeItemFromCart(cartId, itemId, quantity) {
    try {
      const cartItem = await CartItem.findOne({ where: { cart_id: cartId, item_id: itemId } });
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }
      // delete the item from the cart if the quantity after removal is 0, otherwise decrement the quantity
      // and save the cart item
      if (cartItem.quantity - quantity <= 0) {
        await cartItem.destroy();
      } else {
        cartItem.quantity -= quantity;
        await cartItem.save();
      }
    }
    catch (error) {
      throw new Error('Error removing item from cart');
    }
  }
}

module.exports = CartRepository;
