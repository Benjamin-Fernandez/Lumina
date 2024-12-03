const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, "Please provide an email"],
    },
    userName: {
      type: String,
      required: [true, "Please provide a username"],
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    version: {
      type: String,
      required: [true, "Please provide a version"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    activated: {
      type: Boolean,
      required: [true, "Please provide an activation status"],
    },
    schema: {
      type: String,
      required: [true, "Please provide a schema"],
    },
  },
  {
    timestamps: true, // to organize by time created
  }
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  favourite_chatbot: {
    type: [chatbotSchema],
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
const Chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = { User, Chatbot };
