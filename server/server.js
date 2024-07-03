const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');
const Dog = require('./models/dog');

require('dotenv').config(); // Load environment variables from .env file

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://barkbuddydog.com',
  'https://barkbuddydog.netlify.app'
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin - like mobile apps or curl requests
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable cookies and other credentials
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to BarkBuddy!');
});

app.post('/api/dogs', upload.single('image'), async (req, res) => {
  try {
    const imageData = req.file ? req.file.buffer : null;
    const age = req.body.age ? parseInt(req.body.age, 10) : null;
    const dog = await Dog.create({
      name: req.body.name,
      age: age || 0,
      gender: req.body.gender || 'Unknown',
      color: req.body.color || 'Unknown',
      nickname: req.body.nickname || '',
      owner: req.body.owner || 'Unknown',
      breed: req.body.breed || 'Unknown',
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
    const formattedDogs = dogs.map(dog => ({
      ...dog.dataValues,
      image: dog.image ? `data:image/png;base64,${dog.image.toString('base64')}` : null
    }));
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

app.delete('/api/dogs/:id', async (req, res) => {
  try {
    const dogId = req.params.id;
    const result = await Dog.destroy({
      where: {
        id: dogId
      }
    });
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Dog not found' });
    }
  } catch (error) {
    console.error('Error deleting dog:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/dogs/:id', upload.single('image'), async (req, res) => {
  try {
    const dogId = req.params.id;
    const { name, age, gender, color, nickname, owner, breed } = req.body;
    const imageData = req.file ? req.file.buffer : null;

    const dog = await Dog.findByPk(dogId);

    if (dog) {
      dog.name = name || dog.name;
      dog.age = age ? parseInt(age, 10) : dog.age;
      dog.gender = gender || dog.gender;
      dog.color = color || dog.color;
      dog.nickname = nickname || dog.nickname;
      dog.owner = owner || dog.owner;
      dog.breed = breed || dog.breed;
      if (imageData) {
        dog.image = imageData;
      }

      await dog.save();
      res.json(dog);
    } else {
      res.status(404).json({ error: 'Dog not found' });
    }
  } catch (error) {
    console.error('Error updating dog:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dogs/count', async (req, res) => {
  try {
    const count = await Dog.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching dog count:', error);
    res.status(500).json({ error: error.message });
  }
});

sequelize.sync({ alter: true }).then(() => {
  const PORT = process.env.PORT || 8080; // Ensure your application listens on the correct port
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error syncing database:', error);
});
