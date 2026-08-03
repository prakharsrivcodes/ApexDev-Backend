const express = require('express');
const router = express.Router();

const {
  createReport,
  getReportsForTarget,
} = require('../controllers/reportController');

const { protect } = require('../middleware/authMiddleware');

// PROTECTED — must be logged in to submit a report (accountability)
router.post('/', protect, createReport);

// PUBLIC — anyone can view reports on a company/job (transparency)
router.get('/:targetType/:targetId', getReportsForTarget);

module.exports = router;