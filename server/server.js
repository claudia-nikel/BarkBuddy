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

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit for file size
    fieldSize: 15 * 1024 * 1024 // 15 MB limit for field size
  }
});

// CORS configuration
const allowedOrigins = [
  'https://barkbuddydog.com',
  'https://barkbuddydog.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin - like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
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

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to BarkBuddy!');
});

app.post('/api/dogs', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
    }

    const age = req.body.age ? parseInt(req.body.age, 10) : null;
    const dog = await Dog.create({
      name: req.body.name,
      age: age || 0,
      gender: req.body.gender || 'Unknown',
      color: req.body.color || 'Unknown',
      nickname: req.body.nickname || '',
      owner: req.body.owner || 'Unknown',
      breed: req.body.breed || 'Unknown',
      image: imageUrl
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
    let imageUrl = null;

    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
    }

    const dog = await Dog.findByPk(dogId);

    if (dog) {
      dog.name = name || dog.name;
      dog.age = age ? parseInt(age, 10) : dog.age;
      dog.gender = gender || dog.gender;
      dog.color = color || dog.color;
      dog.nickname = nickname || dog.nickname;
      dog.owner = owner || dog.owner;
      dog.breed = breed || dog.breed;
      if (imageUrl) {
        dog.image = imageUrl;
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


