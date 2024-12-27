const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001; // Use the PORT from environment variable or default to 3001

// Connect to MongoDB using the MONGO_URL from environment variable
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint to receive teacherData
app.post('/teacherData', (req, res) => {
  // Extract teacherData from the request body
  const teacherData = req.body.teacherData;

  // Do whatever you want with the teacherData
  console.log('Received teacherData:', teacherData);

  // Send a response back to the client
  res.status(200).json({ message: 'Teacher data received successfully' });
});


