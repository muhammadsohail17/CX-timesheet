const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

const InvoiceController = require("../controllers/generate-invoice");

router.post("/generate-invoice", checkAuth, InvoiceController.generate_invoice);

router.get("/get-hourly-rate/:userId", InvoiceController.get_hourly_rate);

router.get(
  "/get-next-invoice-no/:userId",
  InvoiceController.get_next_invoice_no
);

module.exports = router;
