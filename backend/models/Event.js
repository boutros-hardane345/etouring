const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  time: { type: String },
  location: { type: String },
  description: { type: String },
  price: { type: String },
  spotsLeft: { type: String },
  difficulty: { type: String },
  category: { type: String },
  image: { type: String },
  badge: { type: String },  // e.g., "Upcoming", "Free", "New"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
