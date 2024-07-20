"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each order belongs to one user
      Order.belongsTo(models.User, { foreignKey: "user_id" });
      // Each order has many order items
      Order.hasMany(models.OrderItem, { foreignKey: "order_id" });
    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      cart_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      total_price: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("total_price");
          // Parse the string to a float
          return parseFloat(value);
        },
        set(value) {
          // Convert to string to maintain precision in the database
          this.setDataValue("total_price", value.toString());
        },
      },
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
