const Message = require("../models/message.model");

// GET request to find message by id
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST request to create a new message
const createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT request to update message by id
const updateMessageById = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE request to delete message by id
const deleteMessageById = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMessageById,
  createMessage,
  updateMessageById,
  deleteMessageById,
};
