const mongoose = require('mongoose');

const SalonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  city: { type: String },
  services: [{ name: String, price: Number }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Salon', SalonSchema);
