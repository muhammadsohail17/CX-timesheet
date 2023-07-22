const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: false },
  username: { type: String, required: false },
  rbUserId: { type: Number, required: false },
  email: { type: String, required: false },
  hourlyRate: { type: Number, required: false },
  status: { type: Boolean, required: false },
  companyName: { type: String, required: false },
  companyAddress: { type: String, required: false },
  invoiceNo: { type: String, required: false },
  invoiceDate: { type: String, required: false },
  invoiceDueDate: { type: String, required: false },
  currency: { type: String, required: false },
  monthlyTotals: { type: Number, required: false },
  totalLoggedHours: { type: String, required: false },
  loggingsData: { type: [mongoose.Schema.Types.Mixed], required: false },
});

module.exports = mongoose.model("InvoiceItem", invoiceItemSchema);
