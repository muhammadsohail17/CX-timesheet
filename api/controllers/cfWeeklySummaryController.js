const mongoose = require("mongoose");
const CfWeeklySummary = require("../models/cfWeeklySummary");
const axios = require("axios");
const API_KEY = process.env.X_API_KEY;

exports.create_cf_weekly_summary = async (req, res) => {
  try {
    // const workspaceId = "643396ff3571b66d0266969e";
    const url =
      "https://reports.api.clockify.me/v1/workspaces/643396ff3571b66d0266969e/reports/summary";

    const response = await axios.post(url, req.body, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    // Parse CSV response into JSON data
    const csvLines = response.data.split("\r\n");
    const headers = csvLines[0].split(",");
    const weeklyData = [];

    for (let i = 1; i < csvLines.length; i++) {
      const values = csvLines[i]
        .split(",")
        .map((value) => value.replace(/"/g, "").trim());
      const entry = { _id: new mongoose.Types.ObjectId() };
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j].replace(/"/g, "").trim()] = values[j];
      }
      weeklyData.push(entry);
    }
    console.log("weeklyData", weeklyData);

    // Create and save CfWeeklySummary document
    const weeklySummary = new CfWeeklySummary({
      _id: new mongoose.Types.ObjectId(),
      dateRangeStart: req.body.dateRangeStart,
      dateRangeEnd: req.body.dateRangeEnd,
      weeklyData: weeklyData,
    });

    await weeklySummary.save();
    res.status(201).json({
      message: "weeklySummary successfully",
      clockifyResponse: weeklyData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.get_cf_weekly_summary = async (req, res) => {
  try {
    const data = await CfWeeklySummary.findOne()
      .select("weeklyData")
      .lean()
      .exec();

    const weeklyData = data ? data.weeklyData : [];
    console.log("weeklyData", weeklyData);
    const response = {
      count: weeklyData.length,
      data: weeklyData,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
