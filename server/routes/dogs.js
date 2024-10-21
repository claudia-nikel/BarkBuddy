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
  const { name, age, gender, color, nickname, owner, breed, isOwner, notes } = req.body;  // Add "notes" field here
  const image = req.file ? req.file.buffer : null;

  try {
    console.log('Received request to add dog for user:', req.user.sub);
    const newDog = await Dog.create({ 
      name, age, gender, color, nickname, owner, breed, image, user_id: req.user.sub, isOwner: isOwner || false, notes  // Save "notes" field
    });
    console.log('Successfully added dog:', newDog);
    res.json(newDog);
  } catch (error) {
    console.error('Failed to add dog:', error);
    res.status(500).json({ error: 'Failed to create dog' });
  }
});

// Add this route to fetch only the dogs owned by the user
router.get('/my-dogs', checkJwt, async (req, res) => {
  try {
    const myDogs = await Dog.findAll({
      where: {
        user_id: req.user.sub, // Auth0 user ID
        isOwner: true
      }
    });
    console.log('Successfully fetched owned dogs:', myDogs);
    res.json(myDogs);
  } catch (error) {
    console.error('Failed to fetch owned dogs:', error);
    res.status(500).json({ error: 'Failed to fetch owned dogs' });
  }
});

// Update an existing dog for the authenticated user
router.put('/:id', checkJwt, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, color, nickname, owner, breed, isOwner, notes } = req.body;  // Add "notes" field here
  const image = req.file ? req.file.buffer : null;

  try {
    const dog = await Dog.findOne({ where: { id, user_id: req.user.sub } });
    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    // Update dog attributes including ownership and notes
    dog.name = name;
    dog.age = age;
    dog.gender = gender;
    dog.color = color;
    dog.nickname = nickname;
    dog.owner = owner;
    dog.breed = breed;
    dog.isOwner = isOwner !== undefined ? isOwner : dog.isOwner;  // Only update if isOwner is provided
    dog.notes = notes !== undefined ? notes : '';  // Ensure blank notes are stored as empty string
    if (image) {
      dog.image = image;
    }

    await dog.save();
    res.json(dog);
  } catch (error) {
    console.error('Failed to update dog:', error);
    res.status(500).json({ error: 'Failed to update dog' });
  }
});

module.exports = router;