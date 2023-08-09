const express = require("express");
const router = express.Router();

const CfWeeklySummary = require("../models/cfWeeklySummary");

const cf_weekly_summary = require("../controllers/cfWeeklySummaryController");

router.post("/", cf_weekly_summary.create_cf_weekly_summary);

router.get("/", cf_weekly_summary.get_cf_weekly_summary);

module.exports = router;
