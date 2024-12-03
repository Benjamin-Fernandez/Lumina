const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, "Please provide user id"],
    },
    chatbotId: {
      type: String,
      required: [true, "Please provide chatbotId"],
    },
    firstMessage: {
      type: String,
      required: [true, "Please provide first message"],
    },
    lastMessage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // to organize by time created
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
