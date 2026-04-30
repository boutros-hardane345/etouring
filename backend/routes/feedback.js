const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

// GET approved feedback (public)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new feedback (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    const feedback = new Feedback({ name, email, message, rating });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted. It will appear after admin approval.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all feedback (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve feedback
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete feedback
router.delete('/:id', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;