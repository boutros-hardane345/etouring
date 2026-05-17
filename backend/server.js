require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// ============ MIDDLEWARE ============
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ UPLOADS DIR (STATIC + ROUTES) ============
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ============ STATIC FILE SERVING ============
// Serve uploaded images
app.use('/uploads', express.static(uploadDir));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// ============ MONGODB CONNECTION ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/etouring_db';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Make sure MongoDB Atlas is configured correctly');
  });

// ============ API ROUTES ============
// Keep all API handlers in ./routes to avoid duplication.
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/events', require('./routes/events'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', require('./routes/admin'));

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ============ ROOT ROUTE (no more index.html error!) ============
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🚀 E-Touring API is running!',
    admin: '/admin/login.html',
    health: '/api/health'
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📁 Admin Dashboard: /admin/login.html`);
  console.log(`📊 Health check: /api/health\n`);
});
