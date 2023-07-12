const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check_auth");

const LoggingController = require("../controllers/logging");

router.get("/", checkAuth, LoggingController.get_loggings);

router.post("/", checkAuth, LoggingController.create_logging);

router.put("/:loggingId", checkAuth, LoggingController.get_single_log);

router.delete("/:loggingId", checkAuth, LoggingController.delete_logging);

module.exports = router;
