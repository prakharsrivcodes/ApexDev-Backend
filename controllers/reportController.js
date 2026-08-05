const Report = require('../models/Report');
const Company = require('../models/Company');
const JobOffer = require('../models/JobOffer');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');

// 1. CREATE REPORT — any logged-in user can report a Company or JobOffer
const createReport = asyncHandler(async (req, res, next) => {
  const { targetType, targetId, reason, description, rating } = req.body;

  let targetDocument;
  if (targetType === 'Company') {
    targetDocument = await Company.findById(targetId);
  } else if (targetType === 'JobOffer') {
    targetDocument = await JobOffer.findById(targetId);
  } else {
    return next(new ErrorHandler('targetType must be either "Company" or "JobOffer"', 400));
  }

  if (!targetDocument) {
    return next(new ErrorHandler(`${targetType} not found with the given targetId`, 404));
  }

  const newReport = await Report.create({
    reportedBy: req.user.id,
    targetType,
    targetId,
    reason,
    description,
    rating,
    screenshotUrl: req.file ? req.file.filename : null,
  });

  if (targetType === 'Company') {
    await recalculateTrustScore(targetId);
  }

  res.status(201).json({
    message: 'Report submitted successfully!',
    report: newReport,
  });
});

const recalculateTrustScore = async (companyId) => {
  const reports = await Report.find({ targetType: 'Company', targetId: companyId });

  if (reports.length === 0) return;

  const totalRating = reports.reduce((sum, report) => sum + report.rating, 0);
  const averageRating = totalRating / reports.length;
  const newTrustScore = Math.round(averageRating * 20);

  await Company.findByIdAndUpdate(companyId, { trustScore: newTrustScore });
};

// 2. GET ALL REPORTS FOR A SPECIFIC TARGET
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