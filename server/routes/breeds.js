const express = require('express');
const router = express.Router();
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

// Endpoint to fetch breeds
router.get('/', (req, res) => {
  const csvFilePath = path.join(__dirname, '..', 'public', 'dog_breeds.csv');
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');

  Papa.parse(fileContent, {
    header: true,
    complete: (results) => {
      const breeds = results.data.map(row => row.Name);
      res.json(breeds);
    },
    error: (error) => {
      res.status(500).json({ error: 'Failed to parse CSV file' });
    }
  });
});

module.exports = router;
