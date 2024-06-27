const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Routes
const dogsRoutes = require('./routes/dogs');
const breedsRoutes = require('./routes/breeds');

app.use('/api/dogs', dogsRoutes);
app.use('/api/breeds', breedsRoutes);

sequelize.sync().then(() => {
  app.listen(5001, () => {
    console.log('Server is running on port 5001');
  });
}).catch(error => {
  console.log('Error syncing database:', error);
});

