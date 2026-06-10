const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { authenticateToken, requireAdmin } = require('../auth');

const router = express.Router();
const dataDir = path.join(__dirname, '..', 'data');
const uploadsDir = path.join(__dirname, '..', 'uploads');
const filesPath = path.join(dataDir, 'files.json');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = Buffer.from(file.originalname, 'latin1').toString('utf-8');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

function getFiles() {
  if (!fs.existsSync(filesPath)) return [];
  return JSON.parse(fs.readFileSync(filesPath, 'utf-8'));
}

function saveFiles(files) {
  fs.writeFileSync(filesPath, JSON.stringify(files, null, 2));
}

// GET /api/files — list all files (public, no auth required)
router.get('/', (req, res) => {
  const files = getFiles();
  const { category, subCategory } = req.query;

  let result = files;
  if (category && category !== 'all') {
    result = files.filter(f => f.category === category);
  }

  // Optional sub-category filter (grade level: chuyi/chuer/chusan/gaoyi/gaoer/gaosan)
  if (subCategory) {
    result = result.filter(f => f.subCategory === subCategory);
  }

  // Sort by upload time, newest first
  result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  res.json(result);
});

// GET /api/files/:id/download — download file (auth required, permission checked)
router.get('/:id/download', authenticateToken, (req, res) => {
  const files = getFiles();
  const file = files.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({ error: '文件不存在' });
  }

  // Permission check: admin can download all, students need matching permission
  const userPermissions = req.user.permissions || [];
  if (req.user.role !== 'admin' && !userPermissions.includes(file.category)) {
    return res.status(403).json({ error: '你没有该分类的下载权限' });
  }

  const filePath = path.join(uploadsDir, file.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件已被删除' });
  }

  const ext = path.extname(file.originalName);
  const downloadName = file.displayName + ext;
  res.download(filePath, downloadName);
});

// POST /api/files/upload — upload file (admin only)
router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择要上传的文件' });
  }

  const { displayName, description, category, subCategory } = req.body;

  if (!displayName || !category) {
    // Clean up uploaded file if metadata missing
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: '请填写文件名称和分类' });
  }

  const files = getFiles();
  const newFile = {
    id: String(Date.now()),
    filename: req.file.filename,
    displayName: displayName.trim(),
    description: (description || '').trim(),
    category: category.trim(),
    subCategory: (subCategory && subCategory.trim()) || null,
    originalName: Buffer.from(req.file.originalname, 'latin1').toString('utf-8'),
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  };

  files.push(newFile);
  saveFiles(files);

  res.status(201).json(newFile);
});

// PUT /api/files/:id — rename file (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { displayName, description, subCategory } = req.body;

  if (!displayName || !displayName.trim()) {
    return res.status(400).json({ error: '请填写文件名称' });
  }

  const files = getFiles();
  const file = files.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({ error: '文件不存在' });
  }

  file.displayName = displayName.trim();
  if (description !== undefined) {
    file.description = (description || '').trim();
  }
  if (subCategory !== undefined) {
    file.subCategory = (subCategory && subCategory.trim()) || null;
  }
  saveFiles(files);

  res.json(file);
});

// DELETE /api/files/:id — delete file (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const files = getFiles();
  const index = files.findIndex(f => f.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: '文件不存在' });
  }

  const file = files[index];

  // Delete physical file
  const filePath = path.join(uploadsDir, file.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from metadata
  files.splice(index, 1);
  saveFiles(files);

  res.json({ message: '文件已删除', id: req.params.id });
});

module.exports = router;
