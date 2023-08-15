const mongoose = require("mongoose");

const cfWeeklySummarySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  dateRangeStart: { type: String, required: true },
  dateRangeEnd: { type: String, required: true },
  weeklyData: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CfWeeklySummary", cfWeeklySummarySchema);
