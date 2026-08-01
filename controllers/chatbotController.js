const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const analyzeJobOfferWithAI = require('../utils/geminiHelper');

// POST endpoint — user pastes any job offer text, AI analyzes it
const checkJobOfferText = asyncHandler(async (req, res, next) => {
  const { jobText } = req.body;

  if (!jobText || jobText.trim().length < 10) {
    return next(new ErrorHandler('Please provide job offer text to analyze (min 10 characters).', 400));
  }

  const aiResult = await analyzeJobOfferWithAI(jobText);

  res.status(200).json({
    message: 'Analysis complete',
    analysis: aiResult,
  });
});

module.exports = { checkJobOfferText };