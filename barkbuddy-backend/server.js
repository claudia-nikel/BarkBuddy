const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');
const Dog = require('./models/dog');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/dogs', upload.single('image'), async (req, res) => {
  try {
    const imageData = req.file ? req.file.buffer : null;
    const age = req.body.age ? parseInt(req.body.age, 10) : null; // Handle default value for age
    const dog = await Dog.create({
      name: req.body.name,
      age: age || 0, // Default to 0 if age is not provided
      gender: req.body.gender || 'Unknown', // Default to 'Unknown' if gender is not provided
      color: req.body.color || 'Unknown', // Default to 'Unknown' if color is not provided
      nickname: req.body.nickname || '', // Default to empty string if nickname is not provided
      owner: req.body.owner || 'Unknown', // Default to 'Unknown' if owner is not provided
      breed: req.body.breed || 'Unknown', // Default to 'Unknown' if breed is not provided
      image: imageData
    });
    res.json(dog);
  } catch (error) {
    console.error('Error creating dog:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    const formattedDogs = dogs.map(dog => {
      return {
        ...dog.dataValues,
        image: dog.image ? `data:image/png;base64,${dog.image.toString('base64')}` : null
      };
    });
    res.json(formattedDogs);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/breeds', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public', 'dog_breeds.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const results = Papa.parse(fileContent, { header: true });
    res.json(results.data);
  } catch (error) {
    console.error('Error fetching breeds:', error);
    res.status(500).json({ error: error.message });
  }
});

sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT || 5001, () => {
    console.log('Server is running on port 5001');
  });
}).catch(error => {
  console.log('Error syncing database:', error);
});

