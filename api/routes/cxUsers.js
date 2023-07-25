const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check_auth");
const cx_usersController = require("../controllers/cxUsersController");

router.get("/", cx_usersController.get_cx_users);

router.post("/", checkAuth, cx_usersController.create_cx_users);

router.delete("/:userId", checkAuth, cx_usersController.delete_cx_users);

module.exports = router;
