const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Add a score
router.post('/', auth, async (req, res) => {
  try {
    const { value, date } = req.body;
    
    // Check if score for this date already exists
    const existingScoreIndex = req.user.scores.findIndex(s => 
      new Date(s.date).toDateString() === new Date(date).toDateString()
    );
    
    if (existingScoreIndex !== -1) {
      return res.status(400).send({ error: 'Only one score entry is permitted per date.' });
    }

    req.user.scores.push({ value, date });
    await req.user.save();
    
    res.status(201).send(req.user.scores);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get scores (latest first)
router.get('/', auth, async (req, res) => {
  const sortedScores = req.user.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.send(sortedScores);
});

// Delete a score
router.delete('/:id', auth, async (req, res) => {
  try {
    req.user.scores = req.user.scores.filter(s => s._id.toString() !== req.params.id);
    await req.user.save();
    res.send(req.user.scores);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
