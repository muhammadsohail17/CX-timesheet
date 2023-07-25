const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check_auth");
const CxUsersController = require("../controllers/cx_usersController");

router.get("/", CxUsersController.get_cx_users);

router.post("/", checkAuth, CxUsersController.create_cx_users);

router.delete("/:userId", checkAuth, CxUsersController.delete_cx_users);

module.exports = router;
