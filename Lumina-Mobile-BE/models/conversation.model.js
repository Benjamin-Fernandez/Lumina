const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: [true, "Please provide user id"],
    },
    chatbot: {
      type: String,
      required: [true, "Please provide chatbot"],
    },
  },
  {
    timestamps: true, // to organize by time created
  }
);
