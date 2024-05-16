'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Each user can have multiple orders
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      // Each user has one cart
      User.hasOne(models.Cart, { foreignKey: 'user_id' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
