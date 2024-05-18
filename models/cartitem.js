'use strict';
const { Model } = require('sequelize');

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
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Carts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    added_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'CartItem',
  });

  return CartItem;
};
