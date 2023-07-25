const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

const TaskController = require("../controllers/taskController");

router.get("/", TaskController.get_tasks);

router.post("/", checkAuth, TaskController.create_task);

router.delete("/:taskId", checkAuth, TaskController.delete_task);

module.exports = router;
