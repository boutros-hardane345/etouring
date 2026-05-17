const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');

// GET all plans (public)
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find().collation({ locale: 'en', strength: 2 });

    const extractNumber = (name) => {
      const s = String(name || '');
      const m = s.match(/\b(\d{1,3})\b/);
      return m ? parseInt(m[1], 10) : null;
    };

    // Sort in JS so we can do "nulls last" + special numbered categories.
    plans.sort((a, b) => {
      const ca = String(a.category || '');
      const cb = String(b.category || '');
      const ccmp = ca.localeCompare(cb, undefined, { sensitivity: 'base' });
      if (ccmp !== 0) return ccmp;

      const category = ca;
      const sa = a.sortOrder;
      const sb = b.sortOrder;

      const na = Number.isFinite(sa) ? sa : ((category === 'Religious Tour' || category === 'Road trip') ? (extractNumber(a.name) ?? Number.POSITIVE_INFINITY) : Number.POSITIVE_INFINITY);
      const nb = Number.isFinite(sb) ? sb : ((category === 'Religious Tour' || category === 'Road trip') ? (extractNumber(b.name) ?? Number.POSITIVE_INFINITY) : Number.POSITIVE_INFINITY);
      if (na !== nb) return na - nb;

      return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
    });

    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE plan
router.post('/', auth, async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE plan
router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    // Best-effort cleanup of uploaded image.
    if (plan.image && String(plan.image).startsWith('/uploads/')) {
      const filename = path.basename(String(plan.image));
      const filepath = path.join(uploadDir, filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
