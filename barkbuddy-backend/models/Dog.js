const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dog = sequelize.define('Dog', {
  id: {
    type: DataTypes.UUID, // Use UUID for unique id
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB('long'), // Define as BLOB
    allowNull: true,
  },
});

module.exports = Dog;
