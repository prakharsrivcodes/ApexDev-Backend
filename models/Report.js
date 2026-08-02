const mongoose = require('mongoose');

// Report Schema — stores user-submitted reports/reviews against a Company or JobOffer
const reportSchema = new mongoose.Schema(
  {
    // Which user submitted this report
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // A report can be about EITHER a Company OR a JobOffer (not both required)
    // We store the type separately so we know which one to look at
    targetType: {
      type: String,
      enum: ['Company', 'JobOffer'],
      required: [true, 'Target type is required (Company or JobOffer)'],
    },

    // The ID of whichever Company or JobOffer is being reported
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Note: no fixed 'ref' here because it depends on targetType —
      // this is called a "dynamic reference", we'll handle it in the controller
    },

    // Short reason/category for the report
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      trim: true,
    },

    // Optional detailed description from the user
    description: {
      type: String,
      trim: true,
      default: '',
    },

    // A rating out of 5 — lets users also leave a genuine review score, not just flag scams
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating is required'],
    },

    // Admin can mark a report as reviewed/resolved
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;