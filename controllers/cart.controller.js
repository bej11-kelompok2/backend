const CartService = require('../usecase/cart.service');
const BaseResponse = require('../util/base.response');

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  getUserCart = async (req, res) => {
    try {
      const cart = await this.cartService.userCart(req.params.userId);
      res.json(new BaseResponse(true, 'Cart found', cart));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  addItemToCart = async (req, res) => {
    try {
      const cart = await this.cartService.addItemToCart(req.params.userId, req.body.itemId, req.body.quantity);
      res.json(new BaseResponse(true, 'Item added to cart', cart));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  removeItemFromCart = async (req, res) => {
    try {
      const cart = await this.cartService.removeItemFromCart(req.params.userId, req.body.itemId, req.body.quantity);
      res.json(new BaseResponse(true, 'Item removed from cart', cart));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }
}

module.exports = CartController;
