const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');
const { verifyConnection } = require('./config/email');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://yux.org.cn',
    'https://www.yux.org.cn',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
}));
app.use(express.json());

// Ensure data files exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const usersPath = path.join(dataDir, 'users.json');
const filesPath = path.join(dataDir, 'files.json');

if (!fs.existsSync(usersPath)) {
  fs.writeFileSync(usersPath, JSON.stringify({
    "frank": { "password": "frank202507", "role": "admin", "displayName": "管理员", "permissions": ["zhongkao", "gaokao", "alevel", "ib"] },
    "student": { "password": "math2026", "role": "student", "displayName": "示例学生", "permissions": ["zhongkao", "gaokao"] }
  }, null, 2));
}

if (!fs.existsSync(filesPath)) {
  fs.writeFileSync(filesPath, JSON.stringify([], null, 2));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Serve uploaded files via download route (handled in routes)
app.use('/uploads', express.static(uploadsDir));

// Serve React static files in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

// Verify SMTP connection on startup
verifyConnection().then(ok => {
  if (!ok) console.warn('⚠️ 邮件功能不可用，请在 163 邮箱重新获取 SMTP 授权码');
});

app.listen(PORT, () => {
  console.log(`誉学坊 Yux Academy server running on http://localhost:${PORT}`);
});
