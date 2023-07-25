const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check_auth");
const InvoiceController = require("../controllers/invoiceController");

router.get("/", InvoiceController.get_invoice);

router.post("/", checkAuth, InvoiceController.create_invoice);

router.get("/:invoiceId", checkAuth, InvoiceController.get_single_invoice);

router.put("/:invoiceId", checkAuth, InvoiceController.update_invoice);

router.delete("/:invoiceId", checkAuth, InvoiceController.delete_invoice);

module.exports = router;
