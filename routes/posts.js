const express = require('express');
const router = express.Router();
console.log('✅ posts.js router loaded');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

// File storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware to authenticate JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Test route
router.get('/test', (req, res) => {
  res.send('Posts route is working!');
});

// Get posts by tag
router.get('/tag/:tag', async (req, res) => {
  const { tag } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const query = { tags: tag };
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching paginated tag posts:', error);
    res.status(500).json({ error: 'Error fetching posts by tag' });
  }
});

// Upload image
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename });
});

// Create a new post
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  const { title, content, images, tags } = req.body;
  const username = req.user.username;

  try {
    const newPost = new Post({
      title,
      content,
      images,
      tags: Array.isArray(tags) ? tags : [],
      author: username,
    });

    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Get all posts (paginated)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get a single post by ID — this MUST be last!
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// Update a post by ID
router.put('/:id', authenticate, async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags: Array.isArray(tags) ? tags : [],
      },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post by ID
router.delete('/:id', authenticate, async (req, res) => {
  console.log('Received DELETE request for ID:', req.params.id);
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post successfully deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Could not delete post' });
  }
});

module.exports = router;
