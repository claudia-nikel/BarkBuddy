const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dog = sequelize.define('Dog', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.BLOB('long'), // Use BLOB for binary data
    allowNull: true
  }
});

module.exports = Dog;
