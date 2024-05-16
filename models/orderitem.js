'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // Each orderItem belongs to one order
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
      // Each orderItem corresponds to one item
      OrderItem.belongsTo(models.Item, { foreignKey: 'item_id' });
    }
  }
  OrderItem.init({
    order_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};
