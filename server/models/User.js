const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ScoreSchema = new mongoose.Schema({
  value: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, required: true }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'lapsed'], default: 'inactive' },
    plan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
    expiresAt: Date,
    renewalDate: Date
  },
  charity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  contributionPercentage: { type: Number, default: 10, min: 10 },
  scores: [ScoreSchema],
  totalWinnings: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  if (this.scores.length > 5) {
    this.scores = this.scores.sort((a, b) => b.date - a.date).slice(0, 5);
  }
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
