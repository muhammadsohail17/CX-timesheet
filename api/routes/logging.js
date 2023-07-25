const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check_auth");
const loggingController = require("../controllers/loggingController");

router.get("/", loggingController.get_loggings);

router.post("/", checkAuth, loggingController.create_logging);

router.put("/:loggingId", checkAuth, loggingController.get_single_log);

router.delete("/:loggingId", checkAuth, loggingController.delete_logging);

module.exports = router;
