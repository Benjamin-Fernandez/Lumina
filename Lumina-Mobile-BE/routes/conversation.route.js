const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation.model");
const {
  getConversationById,
  createConversation,
  updateConversationById,
  deleteConversationById,
} = require("../controllers/conversation.controller");

// GET request to find conversation by id
router.get("/:id", getConversationById);

// POST request to create a new conversation
router.post("/", createConversation);

// PUT request to update conversation by id
router.put("/:id", updateConversationById);

// DELETE request to delete conversation by id
router.delete("/:id", deleteConversationById);
