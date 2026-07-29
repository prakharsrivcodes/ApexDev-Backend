const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');

// 1. CREATE COMPANY — only recruiters and admin
const createCompany = asyncHandler(async (req, res, next) => {
  const { name, registrationNumber, website } = req.body;

  // req.user comes here from authMiddleware.js, which verifies the JWT token and attaches user info to req.user
  
  const newCompany = await Company.create({
    name,
    registrationNumber,
    website,
    createdBy: req.user.id, // saves logged-in user's ID
  });

  res.status(201).json({
    message: 'Company added successfully!',
    company: newCompany,
  });
});

// 2. GET ALL COMPANIES
const getAllCompanies = asyncHandler(async (req, res, next) => {
  const companies = await Company.find(); // saari companies laao DB se

  res.status(200).json({
    message: 'Companies fetched successfully',
    count: companies.length,
    companies,
  });
});

// 3. GET SINGLE COMPANY BY ID
const getCompanyById = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    // req.params.id comes from the URL, e.g., /api/companies/:80809809809 but we can also use req.params.companyId if we define the route as /api/companies/:companyId

  if (!company) {
    return next(new ErrorHandler('Company not found', 404));
  }

  res.status(200).json({
    message: 'Company fetched successfully',
    company,
  });
});

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
};