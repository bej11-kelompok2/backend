"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each orderItem belongs to one order
      OrderItem.belongsTo(models.Order, { foreignKey: "id" });
      // Each orderItem corresponds to one item
      OrderItem.belongsTo(models.Item, { foreignKey: "id" });
    }
  }
  OrderItem.init(
    {
      order_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );
  return OrderItem;
};
