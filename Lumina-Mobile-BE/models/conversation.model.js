import messageSchema from "./message.model";

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  conversation_id: {
    type: String,
    required: true,
  },
  messages: {
    type: [messageSchema],
    required: [true, "Please provide messages"],
  },
  chatbot: {
    type: String,
    required: [true, "Please provide chatbot"],
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
