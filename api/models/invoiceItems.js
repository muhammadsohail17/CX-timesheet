const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: false },
  rbUserId: { type: Number, required: false },
  rbProjectId: { type: Number, required: false },
  hourlyRate: { type: Number, required: false },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: false,
  },
  companyName: { type: String, required: false },
  companyAddress: { type: String, required: false },
  currency: { type: String, required: false },
  invoiceDate: { type: String, required: false },
  invoiceDueDate: { type: String, required: false },
  monthlyTotals: { type: Number, required: false },
  dateFrom: { type: Number, required: false },
  dateTo: { type: Number, required: false },
  totalLoggedHours: { type: Number, required: false },
  loggingsData: { type: [mongoose.Schema.Types.Mixed], required: false },
});

module.exports = mongoose.model("InvoiceItem", invoiceItemSchema);
