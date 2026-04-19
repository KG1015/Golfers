const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, charityId } = req.body;
    const user = new User({ name, email, password, charity: charityId });
    await user.save();
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'supersecret123');
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: 'Login failed!' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Login failed!' });
    }
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'supersecret123');
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Profile
router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
