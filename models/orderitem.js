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
      OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
      // Each orderItem corresponds to one item
      OrderItem.belongsTo(models.Item, { foreignKey: "item_id" });
    }
  }
  OrderItem.init(
    {
      order_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("price");
          // Parse the string to a float
          return parseFloat(value);
        },
        set(value) {
          // Convert to string to maintain precision in the database
          this.setDataValue("price", value.toString());
        },
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );
  return OrderItem;
};
