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

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/dogs', upload.single('image'), async (req, res) => {
  try {
    const imageData = req.file ? req.file.buffer : null;
    const dog = await Dog.create({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      color: req.body.color,
      nickname: req.body.nickname,
      owner: req.body.owner,
      breed: req.body.breed,
      image: imageData ? Buffer.from(imageData) : null // Convert image data to Buffer
    });
    res.json(dog);
  } catch (error) {
    console.error('Error creating dog:', error); // Add detailed logging here
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.json(dogs);
  } catch (error) {
    console.error('Error fetching dogs:', error); // Add detailed logging here
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch breeds
app.get('/api/breeds', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public', 'dog_breeds.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const results = Papa.parse(fileContent, { header: true });
    res.json(results.data);
  } catch (error) {
    console.error('Error fetching breeds:', error); // Add detailed logging here
    res.status(500).json({ error: error.message });
  }
});

sequelize.sync({ alter: true }).then(() => { // Ensure the database schema is updated
  app.listen(process.env.PORT || 5001, () => {
    console.log('Server is running on port 5001');
  });
}).catch(error => {
  console.log('Error syncing database:', error);
});

