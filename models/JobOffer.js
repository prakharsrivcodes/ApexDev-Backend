const mongoose = require('mongoose');

// JobOffer Schema — stores individual job postings, linked to a Company
const jobOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },

    // Salary offered — stored as a number for easy comparison later (scam detection)
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
    },

    location: {
      type: String,
      trim: true,
      default: 'Not specified',
    },

    // This flag will be checked in Step 4 scam logic —
    // legit companies almost NEVER ask for money upfront
    requiresUpfrontFee: {
      type: Boolean,
      default: false,
    },

    // Every job offer MUST belong to a company —
    // 'ref: Company' links this field to the Company collection

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },

    // We also track which recruiter posted this specific job
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // A calculated red-flag score — higher means more suspicious.
    // We will actually calculate this in next steps, for now it just defaults to 0.
    scamScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);
module.exports = JobOffer;