'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'images', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Items', 'images');

  }
};
