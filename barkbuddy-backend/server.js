const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const multer = require('multer');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/api/dogs', upload.single('image'), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  // Save other dog details along with imageUrl to the database
  // Your database save logic here
});

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5001, () => {
    console.log('Server is running on port 5001');
  });
}).catch(error => {
  console.log('Error syncing database:', error);
});
