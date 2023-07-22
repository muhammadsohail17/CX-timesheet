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
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InvoiceItem",
    required: false,
  },
  customItems: {
    type: [customItemSchema],
    required: false,
  },
});

module.exports = mongoose.model("Invoice", invoiceScheema);
