const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['individual', 'group'], default: 'individual' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  location: { type: String },
  priceIndividual: { type: Number },
  priceGroup: { type: Number },
  features: [String],
  popular: { type: Boolean, default: false },
  image: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);