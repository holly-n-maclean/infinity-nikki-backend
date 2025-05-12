const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/blog');

async function createUser() {
  const user = new User({
    username: 'admin',
    password: '1234abcd', // plain password
  });

  await user.save(); // ✅ .pre('save') will hash it automatically
  console.log('✅ New user created');
  mongoose.disconnect();
}

createUser();