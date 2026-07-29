const mongoose = require('mongoose');

// Company Schema — stores information about companies posting jobs
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    // Registration number (like GST number, CIN, etc.) helps verify a real company
    registrationNumber: {
      type: String,
      trim: true,
      default: null, // optional — company might not have submitted this yet
    },

    website: {
      type: String,
      trim: true,
      default: null,
    },

    // This field decides whether admin has verified this company as REAL or not
    isVerified: {
      type: Boolean,
      default: false, // by default, every new company starts as UNVERIFIED
    },

    // Every company must be linked to the recruiter user who added it
    // 'ref' tells Mongoose this ID points to a document in the 'User' collection
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // A simple trust score out of 100 — we'll use this later in scam detection
    trustScore: {
      type: Number,
      default: 50, // neutral starting score
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Company = mongoose.model('Company', companySchema);
module.exports = Company;