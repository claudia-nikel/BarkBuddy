const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database'); // Database configuration
const app = express();

app.use(cors()); // Allow CORS from all origins
app.use(bodyParser.json());

// Routes
const dogsRoutes = require('./routes/dogs');
const breedsRoutes = require('./routes/breeds'); // Add breeds route

app.use('/api/dogs', dogsRoutes);
app.use('/api/breeds', breedsRoutes); // Use breeds route

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
}).catch(error => {
  console.log('Error syncing database:', error);
});
