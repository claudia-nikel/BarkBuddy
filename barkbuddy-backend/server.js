const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const multer = require('multer');
const Dog = require('./models/dog');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/dogs', upload.single('image'), async (req, res) => {
  try {
    const imageData = req.file ? req.file.buffer : null; // Convert image to binary
    const dog = await Dog.create({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      color: req.body.color,
      nickname: req.body.nickname,
      owner: req.body.owner,
      breed: req.body.breed,
      image: imageData
    });
    res.json(dog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5001, () => {
    console.log('Server is running on port 5001');
  });
}).catch(error => {
  console.log('Error syncing database:', error);
});
