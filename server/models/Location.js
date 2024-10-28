const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  dog_id: {
    type: DataTypes.UUID,  // Foreign key to reference the Dog model
    allowNull: false,
    references: {
      model: 'Dogs', // Name of the table in the DB
      key: 'id',
    },
    onDelete: 'CASCADE', // Ensures that deleting a Dog record also deletes its associated locations
  },
  latitude: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,  // Defaults to the current timestamp when a location is recorded
  },
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields automatically
});

module.exports = Location;
