const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('barkbuddy', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
