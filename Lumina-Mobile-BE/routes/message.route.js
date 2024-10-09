const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");

const {
  getMessageById,
  createMessage,
  getMessagesByConversationId,
  // updateMessageById,
  deleteMessageByConversationId,
  deleteMessageById,
} = require("../controllers/message.controller");

// GET request to find all messages in a conversation
router.get("/conversation/:conversationId", getMessagesByConversationId);

// GET request to find message by id
router.get("/:id", getMessageById);

// POST request to create a new message
router.post("/", createMessage);

// PUT request to update message by id
// router.put("/:id", updateMessageById);

// DELETE request to delete message by id
router.delete("/:id", deleteMessageById);

// DELETE request to delete all messages in a conversation
router.delete("/conversation/:conversationId", deleteMessageByConversationId);

module.exports = router;
