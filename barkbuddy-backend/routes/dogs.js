const express = require('express');
const router = express.Router();
const Dog = require('../models/Dog');

// Get all dogs
router.get('/', async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.json(dogs);
  } catch (error) {
    console.error('Failed to fetch dogs', error);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// Get a specific dog
router.get('/:id', async (req, res) => {
  try {
    const dog = await Dog.findByPk(req.params.id);
    if (dog) {
      res.json(dog);
    } else {
      res.status(404).json({ error: 'Dog not found' });
    }
  } catch (error) {
    console.error('Failed to fetch dog', error);
    res.status(500).json({ error: 'Failed to fetch dog' });
  }
});

// Create a new dog
router.post('/', async (req, res) => {
  try {
    const dog = await Dog.create(req.body);
    res.status(201).json(dog);
  } catch (error) {
    console.error('Failed to create dog', error);
    res.status(500).json({ error: 'Failed to create dog' });
  }
});

// Update a dog
router.put('/:id', async (req, res) => {
  try {
    const dog = await Dog.findByPk(req.params.id);
    if (dog) {
      await dog.update(req.body);
      res.json(dog);
    } else {
      res.status(404).json({ error: 'Dog not found' });
    }
  } catch (error) {
    console.error('Failed to update dog', error);
    res.status(500).json({ error: 'Failed to update dog' });
  }
});

// Delete a dog
router.delete('/:id', async (req, res) => {
  try {
    const dog = await Dog.findByPk(req.params.id);
    if (dog) {
      await dog.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Dog not found' });
    }
  } catch (error) {
    console.error('Failed to delete dog', error);
    res.status(500).json({ error: 'Failed to delete dog' });
  }
});

module.exports = router;
