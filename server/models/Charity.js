const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL or Base64
  website: { type: String },
  totalRaised: { type: Number, default: 0 },
  impactStatement: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Charity', CharitySchema);
