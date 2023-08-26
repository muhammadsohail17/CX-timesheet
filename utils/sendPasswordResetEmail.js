const nodemailer = require("nodemailer");

// Function to send the password reset email
function sendPasswordResetEmail(userEmail, resetToken) {
  const transporter = nodemailer.createTransport({
    // Configure your email service here
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    // from: "your-email@gmail.com",
    to: userEmail,
    subject: "Password Reset",
    html: `<p>Please click the following link to reset your password: <a href="http://localhost:3001/user/reset-password/${resetToken}">Reset Password</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendPasswordResetEmail;
