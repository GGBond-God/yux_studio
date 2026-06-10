const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken, requireAdmin } = require('../auth');

const router = express.Router();
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

function getUsers() {
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// All routes require admin
router.use(authenticateToken, requireAdmin);

// GET /api/users — list all users
router.get('/', (req, res) => {
  const users = getUsers();
  // Return as array, exclude passwords in response
  const list = Object.entries(users).map(([username, data]) => ({
    username,
    role: data.role,
    displayName: data.displayName,
    permissions: data.permissions || [],
  }));
  res.json(list);
});

// POST /api/users — create a new user
router.post('/', (req, res) => {
  const { username, password, displayName, permissions } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ error: '请输入用户名' });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ error: '请输入密码' });
  }

  const users = getUsers();
  const key = username.trim();

  if (users[key]) {
    return res.status(409).json({ error: '该用户名已存在' });
  }

  users[key] = {
    password: password.trim(),
    role: 'student',
    displayName: (displayName || key).trim(),
    permissions: permissions || [],
  };

  saveUsers(users);
  res.status(201).json({
    username: key,
    role: 'student',
    displayName: users[key].displayName,
    permissions: users[key].permissions,
  });
});

// PUT /api/users/:username — update user
router.put('/:username', (req, res) => {
  const users = getUsers();
  const user = users[req.params.username];

  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  const { password, displayName, permissions } = req.body;

  if (password !== undefined && password.trim()) {
    user.password = password.trim();
  }
  if (displayName !== undefined && displayName.trim()) {
    user.displayName = displayName.trim();
  }
  if (permissions !== undefined) {
    user.permissions = permissions;
  }

  saveUsers(users);
  res.json({
    username: req.params.username,
    role: user.role,
    displayName: user.displayName,
    permissions: user.permissions,
  });
});

// DELETE /api/users/:username — delete user
router.delete('/:username', (req, res) => {
  const users = getUsers();
  const { username } = req.params;

  if (!users[username]) {
    return res.status(404).json({ error: '用户不存在' });
  }

  if (users[username].role === 'admin') {
    return res.status(403).json({ error: '不能删除管理员账号' });
  }

  delete users[username];
  saveUsers(users);
  res.json({ message: '用户已删除', username });
});

module.exports = router;
