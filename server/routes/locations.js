const express = require('express');
const Location = require('../models/Location'); // Adjust to point directly to the Location model
const router = express.Router();
const checkJwt = require('../middleware/auth');

// Add a location for a dog
router.post('/:dogId', checkJwt, async (req, res) => {
    const { dogId } = req.params;
    const { latitude, longitude } = req.body;
  
    // Log to ensure backend receives latitude and longitude
    console.log('Received location data for dogId:', dogId);
    console.log('Latitude:', latitude, 'Longitude:', longitude);
  
    try {
      const location = await Location.create({
        dog_id: dogId,
        latitude,
        longitude,
      });
      console.log('Successfully added location:', location);
      res.json(location);
    } catch (error) {
      console.error('Failed to add location:', error);
      res.status(500).json({ error: 'Failed to add location' });
    }
  });
  
  

// Fetch all locations for a dog
router.get('/:dogId', checkJwt, async (req, res) => {
  const { dogId } = req.params;

  try {
    const locations = await Location.findAll({ where: { dog_id: dogId } });
    res.json(locations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

module.exports = router;
