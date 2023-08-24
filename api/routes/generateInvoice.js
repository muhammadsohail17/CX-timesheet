const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

const invoiceController = require("../controllers/generateInvoiceController");

router.post("/generate-invoice", checkAuth, invoiceController.generate_invoice);

router.get(
  "/generate-weekly-summary/:rbUserId",
  invoiceController.generate_weekly_summary
);

router.post("/generate-invoice/pdf", invoiceController.generate_invoice_pdf);

router.get("/get-hourly-rate/:userId", invoiceController.get_hourly_rate);

router.get(
  "/get-next-invoice-no/:userId",
  invoiceController.get_next_invoice_no
);

module.exports = router;
