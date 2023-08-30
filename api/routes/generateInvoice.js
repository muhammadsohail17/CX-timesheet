const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

const invoiceController = require("../controllers/generateInvoiceController");

router.post("/generate-invoice", checkAuth, invoiceController.generate_invoice);

router.get(
  "/generate-weekly-summary/:rbUserId",
  invoiceController.generate_weekly_summary
);

router.get(
  "/generate-invoice/pdf/:rbUserId",
  invoiceController.generate_invoice_pdf
);

router.get("/get-hourly-rate/:rbUserId", invoiceController.get_hourly_rate);

router.get(
  "/get-next-invoice-no/:rbUserId",
  invoiceController.get_next_invoice_no
);

module.exports = router;
