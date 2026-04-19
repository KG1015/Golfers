const express = require('express');
const router = express.Router();
const Charity = require('../models/Charity');
const { auth, admin } = require('../middleware/auth');

// Get all
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find();
    res.send(charities);
  } catch (e) {
    res.status(500).send();
  }
});

// Create (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const charity = new Charity(req.body);
    await charity.save();
    res.status(201).send(charity);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
