const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendPasswordResetEmail = require("../../utils/sendPasswordResetEmail");

exports.sign_up_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              rbUserId: req.body.rbUserId,
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.login_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            email: user[0].email,
            rbUserId: user[0].rbUserId,
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed!",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_regestered_users = (req, res) => {
  User.find({}, "email") // Fetch only the email field from the User collection
    .exec()
    .then((users) => {
      const registeredEmails = users.map((user) => user.email);
      res.status(200).json(registeredEmails);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_user = (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "User deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:3001/user/signup",
          body: { email: "String", password: "String" },
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

exports.forgot_password = (req, res, next) => {
  const userEmail = req.body.email;
  User.findOne({ email: userEmail })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Generate a reset token and store it in the database
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetToken = resetToken;
      user.save();

      // Send the password reset email
      sendPasswordResetEmail(userEmail, resetToken);

      res.status(200).json({
        message: "Password reset email sent",
        resetToken,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.reset_password = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    console.log(password, confirmPassword);

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 0,
        message: "Password and confirm password do not match!",
      });
    } else {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Find the user with the given email
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({
          status: 0,
          message: "User not found.",
        });
      }

      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        status: 1,
        message: "Password reset successful!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 0,
      message: "An error occurred.",
    });
  }
};
