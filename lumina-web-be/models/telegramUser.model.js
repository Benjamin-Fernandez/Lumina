/**
* TelegramUser Model
* Stores Telegram user state for chatbot selection and query tracking
*
* Ported from: chatbot-middleware/mkiats-dev-telegram/entities.py (User class)
*/


const mongoose = require("mongoose");


const TelegramUserSchema = mongoose.Schema(
 {
   // Telegram chat ID (unique identifier for each Telegram user/chat)
   telegramId: {
     type: String,
     required: [true, "Telegram ID is required"],
     unique: true,
     index: true,
   },
   // Reference to the currently selected plugin/chatbot
   selectedPluginId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Plugin",
     required: false,
     default: null,
   },
   // Flag to prevent concurrent queries (same as is_querying in chatbot-middleware)
   isQuerying: {
     type: Boolean,
     default: false,
   },
   // Track last activity for potential cleanup/analytics
   lastActivity: {
     type: Date,
     default: Date.now,
   },
 },
 {
   timestamps: true,
 }
);


const TelegramUser = mongoose.model("TelegramUser", TelegramUserSchema);
module.exports = TelegramUser;






