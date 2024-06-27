'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'images', {
      type: Sequelize.STRING, // Or any other type you need
      allowNull: true, // Set to false if this field is required
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Items', 'images');
  }
};
