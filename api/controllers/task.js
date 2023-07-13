const Task = require("../models/task");
const mongoose = require("mongoose");

exports.get_tasks = (req, res, next) => {
  Task.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        count: docs.length,
        data: docs.map((doc) => {
          return {
            _id: doc._id,
            rbTaskId: doc.rbTaskId,
            rbProjectId: doc.rbProjectId,
            name: doc.name,
            updatedAt: doc.updatedAt,
            request: {
              type: "GET",
              url: "http://localhost:3001/tasks/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_task = (req, res, next) => {
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    rbTaskId: req.body.rbTaskId,
    rbProjectId: req.body.rbProjectId,
    name: req.body.name,
    updatedAt: req.body.updatedAt,
  });
  task
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Task created successfully",
        data: {
          _id: result._id,
          rbTaskId: result.rbTaskId,
          rbProjectId: result.rbProjectId,
          name: result.name,
          updatedAt: result.updatedAt,
          request: {
            type: "GET",
            url: "http://localhost:3001/tasks/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_task = (req, res, next) => {
  const id = req.params.taskId;
  Task.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Task deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:3001/tasks/",
          body: {
            rbTaskId: "Number",
            rbProjectId: "String",
            name: "String",
            updatedAt: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
