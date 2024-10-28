const express = require('express');
const Dog = require('../models/Dog'); // Ensure correct path to the Dog model
const Location = require('../models/Location'); // Ensure correct path to the Location model
const router = express.Router();
const multer = require('multer');
const checkJwt = require('../middleware/auth'); // Ensure checkJwt is correctly defined and imported

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

console.log('Route /api/dogs hit');


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
  const { name, age, gender, color, nickname, owner, breed, isOwner, notes, latitude, longitude } = req.body; // Include latitude and longitude
  const image = req.file ? req.file.buffer : null;

  try {
    console.log('Received request to add dog for user:', req.user.sub);
    
    // Create the new dog
    const newDog = await Dog.create({ 
      name, 
      age, 
      gender, 
      color, 
      nickname, 
      owner, 
      breed, 
      image, 
      user_id: req.user.sub, 
      isOwner: isOwner || false, 
      notes  // Save notes field
    });

    console.log('Successfully added dog:', newDog);

    // If latitude and longitude are provided, save the location
    if (latitude && longitude) {
      try {
        const location = await Location.create({
          dog_id: newDog.id, // Use the dog's ID
          latitude,
          longitude
        });
        console.log('Successfully added location:', location);
      } catch (error) {
        console.error('Failed to add location:', error);
      }
    }

    // Respond with the newly created dog object (location not included in this response)
    res.json(newDog);
  } catch (error) {
    console.error('Failed to add dog or location:', error);
    res.status(500).json({ error: 'Failed to create dog or location' });
  }
});

// Fetch only the dogs owned by the user
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
  const { name, age, gender, color, nickname, owner, breed, isOwner, notes } = req.body;

  // Ensure boolean is parsed correctly
  const parsedIsOwner = isOwner === 'true' || isOwner === true;  // Allow 'true' as string or boolean true
  const parsedNotes = notes && notes.trim() !== '' ? notes : null;  // Nullify empty strings for notes

  console.log('PUT Request received with:', req.body);
  console.log('Parsed isOwner:', parsedIsOwner, 'Parsed notes:', parsedNotes);

  try {
    const dog = await Dog.findOne({ where: { id, user_id: req.user.sub } });
    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    // Update dog attributes
    dog.name = name;
    dog.age = age;
    dog.gender = gender;
    dog.color = color;
    dog.nickname = nickname;
    dog.owner = owner;
    dog.breed = breed;
    dog.isOwner = parsedIsOwner;  // Now boolean
    dog.notes = parsedNotes;  // Now correctly parsed as null or string

    if (req.file) {
      dog.image = req.file.buffer;  // Handle image file if uploaded
    }

    await dog.save();

    console.log('Dog successfully updated:', dog);
    res.json(dog);
  } catch (error) {
    console.error('Failed to update dog:', error);
    res.status(500).json({ error: 'Failed to update dog' });
  }
});


module.exports = router;
