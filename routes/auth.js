const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    console.log('User input password:', password);
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log('❌ Username not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      console.log('Stored hashed password:', user.password);
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Password mismatch');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      console.log('✅ Login successful');
      res.json({ token });
    } catch (err) {
      console.error('❌ Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;