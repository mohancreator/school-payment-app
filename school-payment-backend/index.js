const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config(); // Load environment variables

const app = express();

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// List all collections when connected to MongoDB
mongoose.connection.on('connected', async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map((col) => col.name));
});

// Define the GET route to fetch all documents
app.get('/', async (req, res) => {
  try {
    console.log('GET / endpoint accessed');
    
    const db = mongoose.connection.db;
    const collectRequest = db.collection('collect_request')

    const fetchedData = await collectRequest.find({}).toArray();
    
    // Send the fetched data as a JSON response
    res.status(200).json({ success: true, data: fetchedData });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Server initiation
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server running successfully on http://localhost:${PORT}`);
});
