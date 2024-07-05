// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const Papa = require('papaparse');
const fs = require('fs');
const Dog = require('./models/Dog');
const dotenv = require('dotenv');

// Load environment variables from the appropriate .env file
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://barkbuddydog.com',
  'https://barkbuddydog.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit for file size
    fieldSize: 15 * 1024 * 1024 // 15 MB limit for field size
  }
});

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to BarkBuddy!');
});

app.post('/api/dogs', upload.single('image'), async (req, res) => {
  try {
    const { name, age, gender, color, nickname, owner, breed } = req.body;
    let imageUrl = null;

    if (req.file) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
    }

    const dog = await Dog.create({
      name,
      age: parseInt(age, 10) || 0,
      gender: gender || 'Unknown',
      color: color || 'Unknown',
      nickname: nickname || '',
      owner: owner || 'Unknown',
      breed: breed || 'Unknown',
      image: imageUrl,
    });

    res.json(dog);
  } catch (error) {
    console.error('Error creating dog:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/dogs/:id', upload.single('image'), async (req, res) => {
  try {
    const dogId = req.params.id;
    const { name, age, gender, color, nickname, owner, breed } = req.body;
    const dog = await Dog.findByPk(dogId);

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    let imageUrl = dog.image;

    if (req.file) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
    }

    dog.name = name || dog.name;
    dog.age = age ? parseInt(age, 10) : dog.age;
    dog.gender = gender || dog.gender;
    dog.color = color || dog.color;
    dog.nickname = nickname || dog.nickname;
    dog.owner = owner || dog.owner;
    dog.breed = breed || dog.breed;
    dog.image = imageUrl;

    await dog.save();
    res.json(dog);
  } catch (error) {
    console.error('Error updating dog:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.json(dogs);
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
        id: dogId,
      },
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
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error syncing database:', error);
});

