const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  favourite_chatbot: {
    type: [String],
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
