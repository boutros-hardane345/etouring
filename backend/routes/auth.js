const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await admin.comparePassword(password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: Create default admin if none exists
// Intentionally NOT auto-creating a default admin.
// Create admin users manually in MongoDB for security.

module.exports = router;
