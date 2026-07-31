const express = require('express');
const router = express.Router();

const {
  createJobOffer,
  getAllJobOffers,
  getJobOfferById,
} = require('../controllers/jobController');

const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// PUBLIC ROUTES — anyone can browse job offers
router.get('/', getAllJobOffers);
router.get('/:id', getJobOfferById);

// PROTECTED ROUTE — must be logged in AND recruiter/admin to post a job
router.post('/', protect, authorize('recruiter', 'admin'), createJobOffer);

module.exports = router;