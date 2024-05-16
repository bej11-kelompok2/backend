'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Each cart belongs to one user
      Cart.belongsTo(models.User, { foreignKey: 'user_id' });
      // Each cart can have multiple cart items
      Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
    }
  }
  Cart.init({
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};
