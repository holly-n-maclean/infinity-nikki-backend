// code defining mongoose schema for nikki blog posts
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
title: String,
  content: String,
  tags: [String],
  images: [String],
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('Post', PostSchema);
    