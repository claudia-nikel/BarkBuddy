const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const Dog = require('./models/Dog'); // Import the Dog model
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
const dogsRoutes = require('./routes/dogs');
const breedsRoutes = require('./routes/breeds');

app.use('/api/dogs', dogsRoutes);
app.use('/api/breeds', breedsRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(5001, () => {
    console.log('Server is running on port 5001');
  });
}).catch(error => {
  console.log('Error syncing database:', error);
});

