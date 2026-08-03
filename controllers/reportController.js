const Report = require('../models/Report');
const Company = require('../models/Company');
const JobOffer = require('../models/JobOffer');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');

// 1. CREATE REPORT — any logged-in user can report a Company or JobOffer
const createReport = asyncHandler(async (req, res, next) => {
  const { targetType, targetId, reason, description, rating } = req.body;

  // STEP A — figure out which model to check, based on targetType
  // This is where we manually resolve the "dynamic reference"
  let targetDocument;
  if (targetType === 'Company') {
    targetDocument = await Company.findById(targetId);
  } else if (targetType === 'JobOffer') {
    targetDocument = await JobOffer.findById(targetId);
  } else {
    return next(new ErrorHandler('targetType must be either "Company" or "JobOffer"', 400));
  }

  // STEP B — if no matching document was found, reject the report
  if (!targetDocument) {
    return next(new ErrorHandler(`${targetType} not found with the given targetId`, 404));
  }

  // STEP C — create the report
  const newReport = await Report.create({
    reportedBy: req.user.id,
    targetType,
    targetId,
    reason,
    description,
    rating,
  });

  // STEP D — if the report is against a Company, recalculate its trustScore
  if (targetType === 'Company') {
    await recalculateTrustScore(targetId);
  }

  res.status(201).json({
    message: 'Report submitted successfully!',
    report: newReport,
  });
});

// HELPER FUNCTION — recalculates a company's trustScore based on all its reports
const recalculateTrustScore = async (companyId) => {
  // Find ALL reports submitted against this specific company
  const reports = await Report.find({ targetType: 'Company', targetId: companyId });

  if (reports.length === 0) return; // no reports, nothing to recalculate

  // Calculate the average rating across all reports
  const totalRating = reports.reduce((sum, report) => sum + report.rating, 0);
  const averageRating = totalRating / reports.length;

  // Convert average rating (1-5 scale) into a trustScore (0-100 scale)
  // e.g. average rating of 5 → trustScore 100, average rating of 1 → trustScore 20
  const newTrustScore = Math.round(averageRating * 20);

  // Update the company's trustScore field in the database
  await Company.findByIdAndUpdate(companyId, { trustScore: newTrustScore });
};

// 2. GET ALL REPORTS FOR A SPECIFIC TARGET (public — anyone can see reports on a company/job)
const getReportsForTarget = asyncHandler(async (req, res, next) => {
  const { targetType, targetId } = req.params;

  const reports = await Report.find({ targetType, targetId }).populate('reportedBy', 'name');

  res.status(200).json({
    message: 'Reports fetched successfully',
    count: reports.length,
    reports,
  });
});

module.exports = {
  createReport,
  getReportsForTarget,
};