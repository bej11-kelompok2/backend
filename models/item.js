"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      // Each item belongs to one seller
      Item.belongsTo(models.User, { foreignKey: "id" });
      // Each item can be in many carts through CartItem
      Item.hasMany(models.CartItem, { foreignKey: "id" });
      // Each item can be in many orders through OrderItem
      Item.hasMany(models.OrderItem, { foreignKey: "id" });
    }
  }
  Item.init(
    {
      seller_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
      images: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
