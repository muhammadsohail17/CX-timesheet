const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");

const taskController = require("../controllers/taskController");

router.get("/", taskController.get_tasks);

router.post("/", checkAuth, taskController.create_task);

router.delete("/:taskId", checkAuth, taskController.delete_task);

module.exports = router;
