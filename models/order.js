'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Each order belongs to one user
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      // Each order can have multiple order items
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    cart_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    total_price: DataTypes.DECIMAL,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
