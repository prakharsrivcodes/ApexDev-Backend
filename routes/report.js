const express = require('express');
const router = express.Router();

const {
  createReport,
  getReportsForTarget,
} = require('../controllers/reportController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// PROTECTED — must be logged in, optional screenshot upload
router.post('/', protect, upload.single('screenshot'), createReport);

// PUBLIC — anyone can view reports on a company/job
router.get('/:targetType/:targetId', getReportsForTarget);

module.exports = router;