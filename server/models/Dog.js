const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Location = require('./Location'); // Import the Location model

const Dog = sequelize.define('Dog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
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
    allowNull: false,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner2: {
    type: DataTypes.STRING, // Second owner (optional)
    allowNull: true,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING, // Allowed values: 'xsmall', 'small', 'medium', 'large', 'xlarge'
    allowNull: true,
    validate: {
      isIn: {
        args: [['xsmall', 'small', 'medium', 'large', 'xlarge']],
        msg: 'Size must be one of: xsmall, small, medium, large, xlarge',
      },
    },
  },
  isFriendly: {
    type: DataTypes.BOOLEAN, // Indicates if the dog is friendly
    defaultValue: true,
  },
  isFavorite: {
    type: DataTypes.BOOLEAN, // Indicates if the dog is a favorite
    defaultValue: false,
  },
  neighborhood: {
    type: DataTypes.STRING, // Neighborhood where the dog lives
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING, // URL to store the image
    allowNull: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isOwner: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Define the relationship
Dog.hasMany(Location, { foreignKey: 'dog_id', onDelete: 'CASCADE' });
Location.belongsTo(Dog, { foreignKey: 'dog_id' });

module.exports = Dog;
