const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");

const {
  getMessageById,
  createMessage,
  updateMessageById,
  deleteMessageById,
} = require("../controllers/message.controller");

// GET request to find message by id
router.get("/:id", getMessageById);

// POST request to create a new message
router.post("/", createMessage);

// PUT request to update message by id
router.put("/:id", updateMessageById);

// DELETE request to delete message by id
router.delete("/:id", deleteMessageById);

module.exports = router;
