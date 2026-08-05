const JobOffer = require('../models/JobOffer');
const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const calculateScamScore = require('../utils/scamDetector');

// 1. CREATE JOB offer only by logged-in recruiter, with companyId provided in the request body
const createJobOffer = asyncHandler(async (req, res, next) => {
  const { title, description, salary, location, requiresUpfrontFee, companyId } = req.body;

  //if companyId is not provided, return an error
  if (!companyId) {
    return next(new ErrorHandler('Company ID is required.', 400));
  }
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new ErrorHandler('Company not found. Please provide a valid companyId.', 404));
  }
  const jobDataForCheck = {
    salary,
    description,
    requiresUpfrontFee,
  };
  const { score, flags } = calculateScamScore(jobDataForCheck, company);

const newJob = await JobOffer.create({
  title,
  description,
  salary,
  location,
  requiresUpfrontFee,
  company: companyId,
  postedBy: req.user.id,
  scamScore: score, 
});

  res.status(201).json({
    message: 'Job offer posted successfully!',
    job: newJob,
    scamCheckFlags: flags,
  });
});

// 2. GET ALL JOB OFFERS — public, with company details populated
const getAllJobOffers = asyncHandler(async (req, res, next) => {
  // Read page & limit from query string, e.g. /api/jobs?page=2&limit=5
  const page = parseInt(req.query.page) || 1;   // default page 1
  const limit = parseInt(req.query.limit) || 10; // default 10 results per page
  const skip = (page - 1) * limit;
  // how many documents to skip

  const jobs = await JobOffer.find()
    .populate('company', 'name isVerified trustScore')
    .populate('postedBy', 'name email')
    .skip(skip)
    .limit(limit);

  const totalJobs = await JobOffer.countDocuments();

  res.status(200).json({
    message: 'Job offers fetched successfully',
    count: jobs.length,
    totalJobs,
    currentPage: page,
    totalPages: Math.ceil(totalJobs / limit),
    jobs,
  });
});

// 3. GET SINGLE JOB OFFER BY ID
const getJobOfferById = asyncHandler(async (req, res, next) => {
  const job = await JobOffer.findById(req.params.id)
    .populate('company', 'name isVerified trustScore')
    .populate('postedBy', 'name email');

  if (!job) {
    return next(new ErrorHandler('Job offer not found', 404));
  }

  res.status(200).json({
    message: 'Job offer fetched successfully',
    job,
  });
});

module.exports = {
  createJobOffer,
  getAllJobOffers,
  getJobOfferById,
};