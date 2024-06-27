const express = require('express');
const { Dog } = require('../models');
const router = express.Router();
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  const { name, age, gender, color, nickname, owner, breed } = req.body;
  const image = req.file ? req.file.buffer : null;

  try {
    const newDog = await Dog.create({ name, age, gender, color, nickname, owner, breed, image });
    res.json(newDog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dog' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, color, nickname, owner, breed } = req.body;
  const image = req.file ? req.file.buffer : null;

  try {
    const dog = await Dog.findByPk(id);
    if (!dog) {
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
    res.json(dog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dog' });
  }
});

module.exports = router;
