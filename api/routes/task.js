const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check_auth");

const TaskController = require("../controllers/task");

router.get("/", checkAuth, TaskController.get_tasks);

router.post("/", checkAuth, TaskController.create_task);

router.delete("/:taskId", checkAuth, TaskController.delete_task);

module.exports = router;
