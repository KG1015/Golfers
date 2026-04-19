const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Draw = require('../models/Draw');

// Get all draws
router.get('/', async (req, res) => {
  const draws = await Draw.find().sort({ drawDate: -1 });
  res.send(draws);
});

// Trigger a new draw (Admin)
router.post('/trigger', auth, admin, async (req, res) => {
  try {
    const { mode } = req.body; // 'random' or 'algorithmic'
    
    // 1. Generate winning numbers (5 unique numbers 1-45)
    let winningNumbers = [];
    while(winningNumbers.length < 5) {
      let r = Math.floor(Math.random() * 45) + 1;
      if(winningNumbers.indexOf(r) === -1) winningNumbers.push(r);
    }
    
    // 2. Identify winners
    const activeUsers = await User.find({ 'subscription.status': 'active' });
    const poolTotal = activeUsers.length * 5; // Mock pool: $5 per user
    
    const pools = {
      fiveMatch: poolTotal * 0.40,
      fourMatch: poolTotal * 0.35,
      threeMatch: poolTotal * 0.25
    };
    
    let winners = [];
    
    activeUsers.forEach(user => {
      const userNumbers = user.scores.map(s => s.value);
      const matches = userNumbers.filter(n => winningNumbers.includes(n)).length;
      
      if (matches >= 3) {
        winners.push({
          user: user._id,
          matchType: matches,
          status: 'pending'
        });
      }
    });
    
    // 3. Calculate prize amounts (split equally in each tier)
    const matchCounts = {
      5: winners.filter(w => w.matchType === 5).length,
      4: winners.filter(w => w.matchType === 4).length,
      3: winners.filter(w => w.matchType === 3).length
    };
    
    winners = winners.map(w => {
      let amount = 0;
      if (w.matchType === 5 && matchCounts[5] > 0) amount = pools.fiveMatch / matchCounts[5];
      if (w.matchType === 4 && matchCounts[4] > 0) amount = pools.fourMatch / matchCounts[4];
      if (w.matchType === 3 && matchCounts[3] > 0) amount = pools.threeMatch / matchCounts[3];
      return { ...w, amount };
    });
    
    const draw = new Draw({
      winningNumbers,
      prizePoolTotal: poolTotal,
      matchPools: pools,
      winners,
      status: 'published' // Auto-publish for simplicity
    });
    
    await draw.save();
    
    // Update user winnings
    for (const w of winners) {
      await User.findByIdAndUpdate(w.user, { $inc: { totalWinnings: w.amount } });
    }
    
    res.status(201).send(draw);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
