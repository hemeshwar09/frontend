const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // optional if you don't implement auth
  city: { type: String, required: true },
  country: { type: String },
  units: { type: String, enum: ['metric','imperial','standard'], default: 'metric' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserPreference', UserPreferenceSchema);
