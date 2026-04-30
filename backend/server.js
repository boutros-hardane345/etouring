require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();

// ============ MIDDLEWARE ============
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:3000', 'https://etouring-website.netlify.app', 'https://etouring-backend.onrender.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ FILE UPLOAD SETUP ============
// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// ============ STATIC FILE SERVING ============
// Serve frontend files (for production)
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve admin files
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// ============ MONGODB MODELS ============
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: String,
  time: String,
  location: String,
  description: String,
  price: String,
  spotsLeft: String,
  difficulty: String,
  category: String,
  image: String,
  badge: String,
  createdAt: { type: Date, default: Date.now }
});

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  type: { type: String, default: 'individual' },
  difficulty: String,
  location: String,
  distance: String,
  duration: String,
  priceIndividual: Number,
  priceGroup: Number,
  features: [String],
  stops: [String],
  popular: { type: Boolean, default: false },
  image: String,
  description: String,
  bestSeason: String,
  includes: [String],
  createdAt: { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  rating: Number,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Event = mongoose.model('Event', eventSchema);
const Plan = mongoose.model('Plan', planSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Admin = mongoose.model('Admin', adminSchema);

// ============ MONGODB CONNECTION ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/etouring_db';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    
    // Create default admin if not exists (only in production)
    try {
      const bcrypt = require('bcrypt');
      const adminExists = await Admin.findOne({ username: 'admin' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({ username: 'admin', password: hashedPassword });
        console.log('✅ Default admin created: admin / admin123');
      }
    } catch (err) {
      console.log('Admin check skipped:', err.message);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Make sure MongoDB Atlas is configured correctly');
  });

// ============ AUTH ROUTE ============
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const bcrypt = require('bcrypt');
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const jwt = require('jsonwebtoken');
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

// ============ IMAGE UPLOAD ROUTES ============
app.post('/api/upload/event', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl: imageUrl, message: 'Image uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/upload/plan', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl: imageUrl, message: 'Image uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/upload/:filename', async (req, res) => {
    try {
        const filepath = path.join(uploadDir, req.params.filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============ EVENTS API ============
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Delete associated image if exists
    if (event.image) {
      const filename = event.image.split('/').pop();
      const filepath = path.join(uploadDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ PLANS API ============
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/plans', async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    // Delete associated image if exists
    if (plan.image) {
      const filename = plan.image.split('/').pop();
      const filepath = path.join(uploadDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ FEEDBACK API ============
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/feedback/all', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/feedback/:id/approve', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id, 
      { approved: true }, 
      { new: true }
    );
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ ADMIN STATS ============
app.get('/api/admin/stats', async (req, res) => {
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

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ============ CATCH-ALL ROUTE (Serve index.html) ============
app.get('*', (req, res) => {
  // Skip API routes and static files
  if (req.url.startsWith('/api')) return;
  if (req.url.startsWith('/admin')) return;
  if (req.url.includes('.')) return;
  
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Admin Dashboard: http://localhost:${PORT}/admin/login.html`);
  console.log(`🔐 Default credentials: admin / admin123`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});