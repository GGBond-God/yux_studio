const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { authenticateToken, requireAdmin } = require('../auth');

const router = express.Router();
const dataDir = path.join(__dirname, '..', 'data');
const uploadsDir = path.join(__dirname, '..', 'uploads');
const filesPath = path.join(dataDir, 'files.json');

// Multer config — use memory storage for Cloudinary uploads
const upload = multer({
  storage: multer.memoryStorage(),
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

  // Cloudinary file: redirect to the secure URL
  if (file.cloudinary_url) {
    return res.redirect(file.cloudinary_url);
  }

  // Legacy local file: stream from disk
  const filePath = path.join(uploadsDir, file.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件已被删除' });
  }

  const ext = path.extname(file.originalName);
  const downloadName = file.displayName + ext;
  res.download(filePath, downloadName);
});

// POST /api/files/upload — upload file to Cloudinary (admin only)
router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择要上传的文件' });
  }

  const { displayName, description, category, subCategory } = req.body;

  if (!displayName || !category) {
    return res.status(400).json({ error: '请填写文件名称和分类' });
  }

  try {
    // Upload file buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf-8');

    const files = getFiles();
    const newFile = {
      id: String(Date.now()),
      displayName: displayName.trim(),
      description: (description || '').trim(),
      category: category.trim(),
      subCategory: (subCategory && subCategory.trim()) || null,
      originalName: originalName,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      // Cloudinary fields
      cloudinary_public_id: uploadResult.public_id,
      cloudinary_url: uploadResult.secure_url,
      cloudinary_resource_type: uploadResult.resource_type,
    };

    files.push(newFile);
    saveFiles(files);

    res.status(201).json(newFile);
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: '文件上传到云存储失败，请稍后再试' });
  }
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
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const files = getFiles();
  const index = files.findIndex(f => f.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: '文件不存在' });
  }

  const file = files[index];

  // Delete from Cloudinary if stored there
  if (file.cloudinary_public_id) {
    try {
      await cloudinary.uploader.destroy(file.cloudinary_public_id, {
        resource_type: file.cloudinary_resource_type || 'image',
      });
    } catch (err) {
      console.error('Cloudinary delete error:', err);
      // Continue with metadata deletion even if Cloudinary delete fails
    }
  }

  // Delete local file if exists (legacy files)
  if (file.filename) {
    const filePath = path.join(uploadsDir, file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Remove from metadata
  files.splice(index, 1);
  saveFiles(files);

  res.json({ message: '文件已删除', id: req.params.id });
});

module.exports = router;
