const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');

// Get statistics
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeSubs = await User.countDocuments({ 'subscription.status': 'active' });
    const totalCharities = await Charity.countDocuments();
    
    // Calculate total prize pool (mock calc: $5 per active sub)
    const totalPrizePool = activeSubs * 5;
    
    res.send({
      totalUsers,
      activeSubs,
      totalCharities,
      totalPrizePool
    });
  } catch (e) {
    res.status(500).send();
  }
});

// Manage users
router.get('/users', auth, admin, async (req, res) => {
  const users = await User.find({ role: 'user' }).populate('charity');
  res.send(users);
});

module.exports = router;
