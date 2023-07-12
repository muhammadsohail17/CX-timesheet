const Logging = require("../models/logging");
const mongoose = require("mongoose");

exports.get_loggings = (req, res, next) => {
  Logging.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_logging = (req, res, next) => {
  const logging = new Logging({
    _id: new mongoose.Types.ObjectId(),
    rbCommentId: req.body.rbCommentId,
    rbUserId: req.body.rbUserId,
    rbTaskId: req.body.rbTaskId,
    minutes: req.body.minutes,
    timeTrackingOn: req.body.timeTrackingOn,
    createdAt: req.body.createdAt,
  });
  logging
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /loggings",
        createdLogging: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_single_log = (req, res, next) => {
  const id = req.params.loggingId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Logging.findOneAndUpdate({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_logging = (req, res, next) => {
  const id = req.params.loggingId;
  Logging.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Log deleted successfully",
        deletedLog: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
