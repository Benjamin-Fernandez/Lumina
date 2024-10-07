const Conversation = require("../models/conversation.model");

// // GET request to find all conversations
// const getConversations = async (req, res) => {
//   try {
//     const conversations = await Conversation.find();
//     res.status(200).json({ conversations });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// GET request to find conversation by id
const getConversationsByEmail = async (req, res) => {
  try {
    const { user_email } = req.params;
    const conversations = await Conversation.findMany({ user_email });
    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST request to create a new conversation
const createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create(req.body);
    res.status(200).json({ conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT request to update conversation by id
const updateConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findByIdAndUpdate(id, req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE request to delete conversation by id
const deleteConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findByIdAndDelete(id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  //   getConversations,
  getConversationsByEmail,
  createConversation,
  updateConversationById,
  deleteConversationById,
};
