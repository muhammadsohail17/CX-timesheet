const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check_auth");
const projectController = require("../controllers/projectController");

router.get("/", projectController.get_projects);

router.post("/", checkAuth, projectController.create_project);

router.get("/:projectId", checkAuth, projectController.get_single_project);

router.put("/:projectId", checkAuth, projectController.update_project);

router.delete("/:projectId", checkAuth, projectController.delete_project);

module.exports = router;
