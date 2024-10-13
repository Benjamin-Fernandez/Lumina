const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide chatbot name"],
    },
    ratings: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: [true, "Please provide chatbot description"],
    },
    image: {
      type: String,
      required: false,
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
