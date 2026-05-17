const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  // Optional explicit ordering inside a category (e.g. "Religious Tour 1..11").
  sortOrder: { type: Number },
  type: { type: String, default: 'individual' },
  difficulty: { type: String },
  location: { type: String },
  distance: { type: String },
  duration: { type: String },
  priceIndividual: { type: Number },
  priceGroup: { type: Number },
  features: [String],
  stops: [String],
  includes: [String],
  popular: { type: Boolean, default: false },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
