const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateToken, authenticateToken } = require('../auth');

const router = express.Router();
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

function getUsers() {
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '请输入账号和密码' });
  }

  const users = getUsers();
  const user = users[username];

  if (!user) {
    return res.status(401).json({ error: '账号或密码错误' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: '账号或密码错误' });
  }

  const token = generateToken(username, user.role, user.permissions || []);

  res.json({
    token,
    username,
    role: user.role,
    displayName: user.displayName,
    permissions: user.permissions || []
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const users = getUsers();
  const user = users[req.user.username];
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json({
    username: req.user.username,
    role: user.role,
    displayName: user.displayName,
    permissions: user.permissions || []
  });
});

module.exports = router;
