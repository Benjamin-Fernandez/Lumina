const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  conversation: {
    type: [String],
    required: [false, ""],
  },
  favourite_chatbots: {
    type: [String],
    required: [false, ""],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
