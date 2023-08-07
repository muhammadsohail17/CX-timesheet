const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  rbUserId: { type: Number, required: false },
  hourlyRate: { type: Number, required: false },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: false,
  },
  invoiceDate: { type: String, required: false },
  invoiceDueDate: { type: String, required: false },
  totalLoggedHours: { type: String, required: false },
  monthlyTotals: { type: Number, required: false },
  dateFrom: { type: Date, required: false },
  dateTo: { type: Date, required: false },
});

module.exports = mongoose.model("InvoiceItem", invoiceItemSchema);
