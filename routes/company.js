const express = require('express');
const router = express.Router();

// Import controller functions we built yesterday
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
} = require('../controllers/companyController');

// Import both middlewares — protect checks login, authorize checks role
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// PUBLIC ROUTES — anyone can view companies, no login needed
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

// PROTECTED ROUTE — must be logged in (protect) AND must be recruiter/admin (authorize)
router.post('/', protect, authorize('recruiter', 'admin'), createCompany);

module.exports = router;