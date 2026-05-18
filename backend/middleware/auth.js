const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
