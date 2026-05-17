const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

function parseEventDate(dateStr) {
  if (!dateStr) return Number.POSITIVE_INFINITY;
  const s = String(dateStr).trim();
  if (!s || /^tba$/i.test(s)) return Number.POSITIVE_INFINITY;
  const ms = Date.parse(s);
  return Number.isFinite(ms) ? ms : Number.POSITIVE_INFINITY;
}

function parseEventTimeToMinutes(timeStr) {
  if (!timeStr) return Number.POSITIVE_INFINITY;
  const s = String(timeStr).trim();
  if (!s || /^tba$/i.test(s)) return Number.POSITIVE_INFINITY;

  const m12 = s.match(/^\s*(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])\s*$/);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const min = m12[2] ? parseInt(m12[2], 10) : 0;
    const ampm = m12[3].toUpperCase();
    if (h === 12) h = 0;
    if (ampm === 'PM') h += 12;
    return h * 60 + min;
  }

  const m24 = s.match(/^\s*(\d{1,2}):(\d{2})\s*$/);
  if (m24) return parseInt(m24[1], 10) * 60 + parseInt(m24[2], 10);

  return Number.POSITIVE_INFINITY;
}

// GET all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .select('title date time location description badge createdAt')
      .lean();
    events.sort((a, b) => {
      const da = parseEventDate(a.date);
      const db = parseEventDate(b.date);
      if (da !== db) return da - db;

      const ta = parseEventTimeToMinutes(a.time);
      const tb = parseEventTimeToMinutes(b.time);
      if (ta !== tb) return ta - tb;

      return String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base' });
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select('title date time location description badge createdAt')
      .lean();
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE event (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
