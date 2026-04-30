const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String },
  location: { type: String },
  description: { type: String },
  price: { type: String },
  spotsLeft: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  category: { type: String, enum: ['hiking', 'cleanup', 'camping', 'workshop'] },
  image: { type: String },
  badge: { type: String },  // e.g., "Upcoming", "Free", "New"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);