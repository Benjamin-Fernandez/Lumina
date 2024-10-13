const express = require("express");
const router = express.Router();
const Chatbot = require("../models/chatbot.model");

const {
  getChatbots,
  getChatbotById,
  updateChatbotById,
  createChatbot,
} = require("../controllers/chatbot.controller");

// GET request to find all chatbots
router.get("/", getChatbots);

// GET request to find chatbot by id
router.get("/:id", getChatbotById);

// POST request to create chatbot
router.post("/", createChatbot);

// PUT request to update chatbot by id
router.put("/:id", updateChatbotById);

module.exports = router;
