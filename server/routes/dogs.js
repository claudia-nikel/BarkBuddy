const express = require('express');
const { Dog } = require('../models');
const router = express.Router();
const multer = require('multer');
const { checkJwt } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all dogs for the authenticated user
router.get('/', checkJwt, async (req, res) => {
  try {
    console.log('Received request to fetch dogs for user:', req.user.sub);
    const dogs = await Dog.findAll({ where: { user_id: req.user.sub } });
    console.log('Successfully fetched dogs:', dogs);
    res.json(dogs);
  } catch (error) {
    console.error('Failed to fetch dogs:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// Create a new dog for the authenticated user
router.post('/', checkJwt, upload.single('image'), async (req, res) => {
  const { name, age, gender, color, nickname, owner, breed } = req.body;
  const image = req.file ? req.file.buffer : null;

  try {
    console.log('Received request to add dog for user:', req.user.sub);
    const newDog = await Dog.create({ 
      name, age, gender, color, nickname, owner, breed, image, user_id: req.user.sub 
    });
    console.log('Successfully added dog:', newDog);
    res.json(newDog);
  } catch (error) {
    console.error('Failed to add dog:', error);
    res.status(500).json({ error: 'Failed to create dog' });
  }
});

// Update an existing dog for the authenticated user
router.put('/:id', checkJwt, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, color, nickname, owner, breed } = req.body;
  const image = req.file ? req.file.buffer : null;

  try {
    console.log('Received request to update dog with id:', id, 'for user:', req.user.sub);
    const dog = await Dog.findOne({ where: { id, user_id: req.user.sub } });
    if (!dog) {
      console.error('Dog not found');
      return res.status(404).json({ error: 'Dog not found' });
    }

    dog.name = name;
    dog.age = age;
    dog.gender = gender;
    dog.color = color;
    dog.nickname = nickname;
    dog.owner = owner;
    dog.breed = breed;
    if (image) {
      dog.image = image;
    }

    await dog.save();
    console.log('Successfully updated dog:', dog);
    res.json(dog);
  } catch (error) {
    console.error('Failed to update dog:', error);
    res.status(500).json({ error: 'Failed to update dog' });
  }
});

module.exports = router;


