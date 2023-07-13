const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

const InvoiceController = require("../controllers/generate-invoice");

router.post("/", checkAuth, InvoiceController.generate_invoice);

module.exports = router;
