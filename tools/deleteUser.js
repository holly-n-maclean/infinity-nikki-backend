const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/blog');

User.deleteOne({ username: 'admin' }).then(() => {
  console.log('✅ Old user deleted');
  mongoose.disconnect();
});