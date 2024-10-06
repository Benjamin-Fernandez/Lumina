const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
  },
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
  timestamp: {
    type: Date,
    required: true,
  },
});

modules.exports = mongoose.model("Message", messageSchema);
