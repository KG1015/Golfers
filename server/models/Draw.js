const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
  drawDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pre-analysis', 'published'], default: 'pre-analysis' },
  winningNumbers: [{ type: Number }], // 5 numbers
  prizePoolTotal: { type: Number, default: 0 },
  matchPools: {
    fiveMatch: { type: Number, default: 0 }, // 40%
    fourMatch: { type: Number, default: 0 }, // 35%
    threeMatch: { type: Number, default: 0 } // 25%
  },
  jackpotRollover: { type: Number, default: 0 },
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchType: { type: Number, enum: [3, 4, 5] },
    amount: { type: Number },
    status: { type: String, enum: ['pending', 'verified', 'paid', 'rejected'], default: 'pending' },
    proofImage: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Draw', DrawSchema);
