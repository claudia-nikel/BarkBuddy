'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Dogs', 'image', {
      type: Sequelize.BLOB('long'),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Dogs', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};