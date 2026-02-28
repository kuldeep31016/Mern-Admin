const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadAndDistribute,
  getDistributedLists
} = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// POST /api/lists/upload - Upload and distribute file
router.post('/upload', protect, upload.single('file'), uploadAndDistribute);

// GET /api/lists - Get all distributed lists
router.get('/', protect, getDistributedLists);

module.exports = router;
