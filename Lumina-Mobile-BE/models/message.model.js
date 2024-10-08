const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: [true, "Please provide conversation id"],
    },
    fromSelf: {
      type: Boolean,
      required: [true, "Please provide sender"],
    },
    content: {
      type: String,
      required: [true, "Please provide message content"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
