const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
