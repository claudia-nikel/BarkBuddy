const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('barkbuddy', 'postgres', 'barkbuddy', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
