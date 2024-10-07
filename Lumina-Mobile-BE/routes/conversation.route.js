const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation.model");
const {
  getConversationsByEmail,
  createConversation,
  updateConversationById,
  deleteConversationById,
} = require("../controllers/conversation.controller");

// // GET request to find all conversations
// router.get("/", getConversations);

// GET request to find conversation by email
router.get("/email/:email", getConversationsByEmail);

// POST request to create a new conversation
router.post("/", createConversation);

// PUT request to update conversation by id
router.put("/:id", updateConversationById);

// DELETE request to delete conversation by id
router.delete("/:id", deleteConversationById);

module.exports = router;
