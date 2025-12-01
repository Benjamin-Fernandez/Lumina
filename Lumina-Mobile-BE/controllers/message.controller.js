const Message = require("../models/message.model");


// GET request to find all messages in a conversation
const getMessagesByConversationId = async (req, res) => {
 try {
   const messages = await Message.find({
     conversationId: req.params.conversationId,
   });
   res.status(200).json(messages);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};


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
   console.log("Creating message with body:", JSON.stringify(req.body));
   const message = await Message.create(req.body);
   console.log("Message created successfully:", message._id);
   res.status(200).json(message);
 } catch (error) {
   console.error("Error creating message:", error.message);
   console.error("Error details:", error);
   res.status(500).json({ error: error.message, details: error.code || error.name });
 }
};


// // PUT request to update message by id
// const updateMessageById = async (req, res) => {
//   try {
//     const message = await Message.findByIdAndUpdate(req.params.id, req.body);
//     res.status(200).json(message);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// DELETE request to delete message by id
const deleteMessageById = async (req, res) => {
 try {
   const message = await Message.findByIdAndDelete(req.params.id);
   res.status(200).json({ message: "Message deleted successfully" });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};


// DELETE request to delete all messages in a conversation
const deleteMessageByConversationId = async (req, res) => {
 try {
   const messages = await Message.deleteMany({
     conversationId: req.params.conversationId,
   });
   res.status(200).json({ message: "Messages deleted successfully" });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};


module.exports = {
 getMessagesByConversationId,
 getMessageById,
 createMessage,
 deleteMessageByConversationId,
 // updateMessageById,
 deleteMessageById,
};





