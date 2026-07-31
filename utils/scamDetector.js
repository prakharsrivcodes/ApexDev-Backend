// This utility function analyzes a job offer and calculates a "scamScore"
// based on simple rule-based checks. Higher score = more suspicious.
// This does NOT use AI — it's plain logic (if/else style checks).
const calculateScamScore = (jobData, companyData) => {
  // We start every job at score 0 (not suspicious at all)
  let score = 0;

  // We'll also collect WHY the score increased, so users can see the reasons
  const flags = [];

  // RULE 1: Company requires an upfront fee — this is a HUGE red flag
  // Legitimate companies almost NEVER ask candidates to pay money.
  if (jobData.requiresUpfrontFee === true) {
    score += 40; // big penalty, this is one of the most common scam patterns
    flags.push('Requires upfront payment — legitimate companies do not ask for fees.');
  }

  // RULE 2: Company is not verified by admin yet
  if (companyData.isVerified === false) {
    score += 15;
    flags.push('Company is not verified on our platform yet.');
  }

  // RULE 3: Unrealistically high salary
  // (This is a simple threshold check — real logic could be smarter later)
  if (jobData.salary > 5000000) {
    score += 20;
    flags.push('Salary seems unrealistically high for a typical job posting.');
  }

  // RULE 4: Very short/vague description (scammers often skip real details)
  if (jobData.description.length < 30) {
    score += 15;
    flags.push('Job description is too short/vague.');
  }

  // RULE 5: Company has a low trustScore (built up over time via reports/reviews)
  if (companyData.trustScore < 30) {
    score += 10;
    flags.push('Company has a low trust score based on community activity.');
  }

  // Make sure score never goes above 100, even if multiple rules trigger together
  if (score > 100) {
    score = 100;
  }

  // Return both the number AND the reasons — controller will use both
  return { score, flags };
};

module.exports = calculateScamScore;