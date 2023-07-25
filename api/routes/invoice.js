const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check_auth");
const invoiceController = require("../controllers/invoiceController");

router.get("/", invoiceController.get_invoice);

router.post("/", checkAuth, invoiceController.create_invoice);

router.get("/:invoiceId", checkAuth, invoiceController.get_single_invoice);

router.put("/:invoiceId", checkAuth, invoiceController.update_invoice);

router.delete("/:invoiceId", checkAuth, invoiceController.delete_invoice);

module.exports = router;
