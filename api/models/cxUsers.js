const mongoose = require("mongoose");

const cx_userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rbUserId: { type: Number, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, required: true },
});

module.exports = mongoose.model("CxUser", cx_userSchema);
