const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/posts'); // import post routes
const app = express();
const authRoutes = require('./routes/auth'); // import auth routes
require('dotenv').config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes); // use auth routes

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));



  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });

 