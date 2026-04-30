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

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: Create default admin if none exists
const createDefaultAdmin = async () => {
  const existing = await Admin.findOne({ username: 'admin' });
  if (!existing) {
    const admin = new Admin({ username: 'admin', password: 'admin123' });
    await admin.save();
    console.log('Default admin created: admin/admin123');
  }
};
createDefaultAdmin();

module.exports = router;