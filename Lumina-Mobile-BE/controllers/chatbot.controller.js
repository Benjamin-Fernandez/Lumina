const { Chatbot } = require("../models/user.model");

// GET request to find all chatbots
const getChatbots = async (req, res) => {
  try {
    const chatbots = await Chatbot.find();
    res.status(200).json({ chatbots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET request to find chatbot by id
const getChatbotById = async (req, res) => {
  try {
    const { id } = req.params;
    const chatbot = await Chatbot.findById(id);
    res.status(200).json({ chatbot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST request to create chatbot ==> for testing only
const createChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.create(req.body);
    res.status(201).json({ chatbot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT request to update chatbot by id
const updateChatbotById = async (req, res) => {
  try {
    const { id } = req.params;
    const chatbot = await Chatbot.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ chatbot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChatbots,
  getChatbotById,
  createChatbot,
  updateChatbotById,
};
