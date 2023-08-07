const mongoose = require("mongoose");

const customItemSchema = new mongoose.Schema({
  customItem: { type: String, required: true },
  customValue: { type: String, required: true },
});

const invoiceScheema = mongoose.Schema({
  userId: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  status: { type: Boolean, required: false },
  invoiceNo: { type: Number, required: true },
  customItems: {
    type: [customItemSchema],
    required: false,
  },
});

module.exports = mongoose.model("Invoice", invoiceScheema);
