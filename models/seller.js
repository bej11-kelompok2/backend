'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    static associate(models) {
      // Each seller has many items
      Seller.hasMany(models.Item, { foreignKey: 'seller_id' });
    }
  }
  Seller.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_number: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Seller',
  });
  return Seller;
};
