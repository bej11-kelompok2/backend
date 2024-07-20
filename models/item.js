"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      // Each item belongs to one seller
      Item.belongsTo(models.User, { foreignKey: "seller_id" });
      // Each item can be in many carts through CartItem
      Item.hasMany(models.CartItem, { foreignKey: "item_id" });
      // Each item can be in many orders through OrderItem
      Item.hasMany(models.OrderItem, { foreignKey: "item_id" });
    }

    toJSON() {
      const attributes = { ...this.get() };
      attributes.price = parseFloat(attributes.price);
      return attributes;
    }
  }
  Item.init(
    {
      seller_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
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
