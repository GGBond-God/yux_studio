const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'frank-math-studio-secret-key-2026';

// Generate JWT token
function generateToken(username, role, permissions) {
  return jwt.sign({ username, role, permissions }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未登录，请先登录' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '登录已过期，请重新登录' });
    }
    req.user = user;
    next();
  });
}

// Admin only middleware
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: '仅管理员可执行此操作' });
  }
}

module.exports = { generateToken, authenticateToken, requireAdmin };
