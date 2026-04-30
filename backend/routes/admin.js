const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Plan = require('../models/Plan');
const Feedback = require('../models/Feedback');

// Dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const eventsCount = await Event.countDocuments();
    const plansCount = await Plan.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ approved: false });
    const totalFeedback = await Feedback.countDocuments();
    res.json({ eventsCount, plansCount, pendingFeedback, totalFeedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;