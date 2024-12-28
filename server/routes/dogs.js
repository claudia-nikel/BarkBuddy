const express = require('express');
const Dog = require('../models/Dog'); // Ensure correct path to the Dog model
const Location = require('../models/Location'); // Ensure correct path to the Location model
const router = express.Router();
const multer = require('multer');
const checkJwt = require('../middleware/auth'); // Ensure checkJwt is correctly defined and imported

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all dogs for the authenticated user
router.get('/', checkJwt, async (req, res) => {
  try {
    const dogs = await Dog.findAll({ where: { user_id: req.user.sub } });
    res.json(dogs);
  } catch (error) {
    console.error('Failed to fetch dogs:', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// Create a new dog for the authenticated user
router.post('/', checkJwt, upload.single('image'), async (req, res) => {
  const { name, age, gender, color, nickname, owner, owner2, breed, size, isFriendly, isFavorite, neighborhood, isOwner, notes, latitude, longitude } = req.body;
  const image = req.file ? req.file.buffer : null;

  try {
    const newDog = await Dog.create({ 
      name, 
      age, 
      gender, 
      color, 
      nickname, 
      owner, 
      owner2, 
      breed, 
      size, 
      isFriendly, 
      isFavorite, 
      neighborhood, 
      image, 
      user_id: req.user.sub, 
      isOwner: isOwner || false, 
      notes
    });

    if (latitude && longitude) {
      await Location.create({
        dog_id: newDog.id,
        latitude,
        longitude,
      });
    }

    res.json(newDog);
  } catch (error) {
    console.error('Failed to create dog:', error);
    res.status(500).json({ error: 'Failed to create dog' });
  }
});

// Update an existing dog for the authenticated user
router.put('/:id', checkJwt, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, color, nickname, owner, owner2, breed, size, isFriendly, isFavorite, neighborhood, isOwner, notes } = req.body;

  try {
    const dog = await Dog.findOne({ where: { id, user_id: req.user.sub } });
    if (!dog) return res.status(404).json({ error: 'Dog not found' });

    dog.name = name || dog.name;
    dog.age = age || dog.age;
    dog.gender = gender || dog.gender;
    dog.color = color || dog.color;
    dog.nickname = nickname || dog.nickname;
    dog.owner = owner || dog.owner;
    dog.owner2 = owner2 || dog.owner2;
    dog.breed = breed || dog.breed;
    dog.size = size || dog.size;
    dog.isFriendly = isFriendly !== undefined ? isFriendly : dog.isFriendly;
    dog.isFavorite = isFavorite !== undefined ? isFavorite : dog.isFavorite;
    dog.neighborhood = neighborhood || dog.neighborhood;
    dog.isOwner = isOwner !== undefined ? isOwner : dog.isOwner;
    dog.notes = notes || dog.notes;

    if (req.file) {
      dog.image = req.file.buffer;
    }

    await dog.save();
    res.json(dog);
  } catch (error) {
    console.error('Failed to update dog:', error);
    res.status(500).json({ error: 'Failed to update dog' });
  }
});

module.exports = router;

