const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/signup", userController.sign_up_user);

router.post("/login", userController.login_user);

router.delete("/:userId", userController.delete_user);

router.get("/get-registered-users", userController.get_regestered_users);

router.post("/forgot-password", userController.forgot_password);

module.exports = router;
