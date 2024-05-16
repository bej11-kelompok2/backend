'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      // Each cartItem belongs to one cart
      CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id' });
      // Each cartItem corresponds to one item
      CartItem.belongsTo(models.Item, { foreignKey: 'item_id' });
    }
  }
  CartItem.init({
    cart_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    added_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};
