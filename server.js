const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/posts'); // import post routes
const app = express();
const authRoutes = require('./routes/auth'); // import auth routes
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes); // use auth routes

mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
      });
}).catch(err => console.error('MongoDB connection error:', err));