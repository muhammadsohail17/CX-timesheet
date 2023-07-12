const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check_auth");

const ProjectController = require("../controllers/project");

router.get("/", checkAuth, ProjectController.get_projects);

router.post("/", checkAuth, ProjectController.create_project);

router.get("/:projectId", checkAuth, ProjectController.get_single_project);

router.put("/:projectId", checkAuth, ProjectController.update_project);

router.delete("/:projectId", checkAuth, ProjectController.delete_project);

module.exports = router;
