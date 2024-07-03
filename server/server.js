const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');
const Dog = require('./models/dog');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config(); // Load environment variables from .env file

const app = express();

// AWS S3 configuration
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

// CORS configuration
const allowedOrigins = [
  'https://barkbuddydog.com',
  'https://barkbuddydog.netlify.app'
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

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to BarkBuddy!');
});

app.post('/api/dogs', upload.single('image'), async (req, res) => {
  try {
    const { name, age, gender, color, nickname, owner, breed } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' // Make the file publicly accessible
    };

    const s3Response = await s3.upload(s3Params).promise();

    const dog = await Dog.create({
      name,
      age: age ? parseInt(age, 10) : null,
      gender: gender || 'Unknown',
      color: color || 'Unknown',
      nickname: nickname || '',
      owner: owner || 'Unknown',
      breed: breed || 'Unknown',
      image_url: s3Response.Location // Save the S3 URL
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
    const file = req.file;

    const dog = await Dog.findByPk(dogId);

    if (dog) {
      dog.name = name || dog.name;
      dog.age = age ? parseInt(age, 10) : dog.age;
      dog.gender = gender || dog.gender;
      dog.color = color || dog.color;
      dog.nickname = nickname || dog.nickname;
      dog.owner = owner || dog.owner;
      dog.breed = breed || dog.breed;

      if (file) {
        const s3Params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${uuidv4()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read' // Make the file publicly accessible
        };

        const s3Response = await s3.upload(s3Params).promise();
        dog.image_url = s3Response.Location; // Update the S3 URL
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

