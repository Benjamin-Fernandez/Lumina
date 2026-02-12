/**
* Telegram Service
* Handles Telegram Bot API communication and message routing
*
* Ported from: chatbot-middleware/mkiats-dev-telegram/telegramClient.py
*/


const axios = require("axios");
const Plugin = require("../models/plugin.model");
const TelegramUser = require("../models/telegramUser.model");


class TelegramService {
 constructor() {
   this.botToken = process.env.TELEGRAM_BOT_TOKEN;
   this.apiUrl = process.env.TELEGRAM_API_URL || "https://api.telegram.org/bot";
 }


 /**
  * Parse incoming Telegram webhook payload
  * Ported from: _common.py -> _parse_payload()
  */
 parsePayload(payload) {
   const message = payload.message || {};
   const callbackQuery = payload.callback_query || {};
   let chatId = null;
   let text = null;
   let callbackData = null;


   if (message && message.chat) {
     chatId = message.chat.id.toString();
     text = message.text || null;
   }
   if (callbackQuery && callbackQuery.message) {
     chatId = callbackQuery.message.chat.id.toString();
     callbackData = callbackQuery.data || null;
   }


   return { message, chatId, text, callbackQuery, callbackData };
 }


 /**
  * Send message via Telegram Bot API
  * Ported from: _common.py -> _execute_url() and _echo_message()
  */
 async sendMessage(chatId, text, options = {}) {
   const url = `${this.apiUrl}${this.botToken}/sendMessage`;
   const payload = {
     chat_id: chatId,
     text: text,
     ...options,
   };


   try {
     await axios.post(url, payload);
     return { success: true };
   } catch (error) {
     console.error("Telegram sendMessage error:", error.message);
     return { success: false, error: error.message };
   }
 }


 /**
  * Process incoming webhook message
  * Main entry point - routes to appropriate handler
  * Ported from: telegramClient.py -> TelegramClient._process_message()
  */
 async processMessage(payload) {
   try {
     const { chatId, text, callbackData } = this.parsePayload(payload);


     if (!chatId) {
       return { success: false, error: "No chat ID found" };
     }


     // Route to appropriate handler
     if (text === "/start") {
       return await this.handleStart(chatId);
     } else if (text === "/list") {
       return await this.handleList(chatId);
     } else if (text === "/help") {
       return await this.handleHelp(chatId);
     } else if (callbackData && callbackData.startsWith("select_")) {
       return await this.handleSelect(chatId, callbackData);
     } else if (text && !text.startsWith("/")) {
       return await this.handleQuery(chatId, text);
     } else {
       return await this.sendMessage(chatId, "Unknown command. Use /help for available commands.");
     }
   } catch (error) {
     console.error("processMessage error:", error);
     return { success: false, error: error.message };
   }
 }


 /**
  * Handle /start command
  * Ported from: _startHandler.py -> command_telegram_start()
  */
 async handleStart(chatId) {
   const welcomeMsg =
     "🤖 Welcome to Lumina Chatbot Marketplace!\n\n" +
     "You can interact with AI chatbots deployed by developers.\n\n" +
     "Commands:\n" +
     "/list - Show available chatbots\n" +
     "/help - Show this help message\n\n" +
     "Get started by typing /list to see available chatbots!";


   return await this.sendMessage(chatId, welcomeMsg);
 }


 /**
  * Handle /help command
  */
 async handleHelp(chatId) {
   const helpMsg =
     "📖 Lumina Bot Help\n\n" +
     "Commands:\n" +
     "/start - Welcome message\n" +
     "/list - Show available chatbots\n" +
     "/help - Show this help\n\n" +
     "After selecting a chatbot, simply type your message to chat with it!";


   return await this.sendMessage(chatId, helpMsg);
 }


 /**
  * Handle /list command - show available chatbots
  * Ported from: _listHandler.py -> command_telegram_list()
  */
 async handleList(chatId) {
   try {
     // Query plugins with telegramSupport enabled and activated
     const plugins = await Plugin.find({
       activated: true,
       telegramSupport: true,
     }).select("_id name telegramDisplayName description");


     if (plugins.length === 0) {
       return await this.sendMessage(
         chatId,
         "No chatbots available at the moment. Check back later!"
       );
     }


     // Build inline keyboard
     const inlineKeyboard = plugins.map((plugin) => [
       {
         text: plugin.telegramDisplayName || plugin.name,
         callback_data: `select_${plugin._id}`,
       },
     ]);


     return await this.sendMessage(chatId, "📋 Available chatbots:", {
       reply_markup: { inline_keyboard: inlineKeyboard },
     });
   } catch (error) {
     console.error("handleList error:", error);
     return await this.sendMessage(
       chatId,
       "Error fetching chatbot list. Please try again later."
     );
   }
 }


 /**
  * Handle chatbot selection callback
  * Ported from: _selectHandler.py -> command_telegram_select()
  */
 async handleSelect(chatId, callbackData) {
   try {
     const pluginId = callbackData.replace("select_", "");


     // Verify plugin exists and is active
     const plugin = await Plugin.findById(pluginId);
     if (!plugin) {
       return await this.sendMessage(
         chatId,
         "Chatbot not found. Use /list to see available chatbots."
       );
     }
     if (!plugin.activated || !plugin.telegramSupport) {
       return await this.sendMessage(
         chatId,
         "This chatbot is no longer available. Use /list to refresh."
       );
     }


     // Upsert TelegramUser with selected plugin
     await TelegramUser.findOneAndUpdate(
       { telegramId: chatId },
       {
         telegramId: chatId,
         selectedPluginId: plugin._id,
         lastActivity: new Date(),
       },
       { upsert: true, new: true }
     );


     const displayName = plugin.telegramDisplayName || plugin.name;
     return await this.sendMessage(
       chatId,
       `✅ ${displayName} selected!\n\nYou can now start chatting. Just type your message.`
     );
   } catch (error) {
     console.error("handleSelect error:", error);
     return await this.sendMessage(
       chatId,
       "Error selecting chatbot. Please try again."
     );
   }
 }


 /**
  * Handle user query - forward to selected chatbot
  * Ported from: _queryHandler.py -> command_telegram_query()
  */
 async handleQuery(chatId, userQuery) {
   try {
     // Get user's selected plugin
     const telegramUser = await TelegramUser.findOne({ telegramId: chatId });


     if (!telegramUser || !telegramUser.selectedPluginId) {
       return await this.sendMessage(
         chatId,
         "No chatbot selected. Use /list to choose a chatbot first."
       );
     }


     // Check if already querying (prevent concurrent requests)
     if (telegramUser.isQuerying) {
       return await this.sendMessage(
         chatId,
         "⏳ Please wait for the current query to complete."
       );
     }


     // Get plugin details
     const plugin = await Plugin.findById(telegramUser.selectedPluginId);
     if (!plugin || !plugin.activated || !plugin.telegramSupport) {
       return await this.sendMessage(
         chatId,
         "Selected chatbot is no longer available. Use /list to choose another."
       );
     }


     // Set querying flag
     await TelegramUser.updateOne(
       { telegramId: chatId },
       { isQuerying: true, lastActivity: new Date() }
     );


     try {
       // Build full endpoint URL
       const chatbotUrl = `${plugin.endpoint}${plugin.path}`;


       // Forward query to chatbot
       const response = await axios.post(
         chatbotUrl,
         {
           query: userQuery,
         },
         {
           timeout: 30000, // 30 second timeout
           headers: {
             "Content-Type": "application/json",
           },
         }
       );


       // Parse response - handle both string and object responses
       let responseText;
       if (typeof response.data === "string") {
         responseText = response.data;
       } else if (response.data && response.data.response) {
         responseText = response.data.response;
       } else if (response.data && response.data.message) {
         responseText = response.data.message;
       } else {
         responseText = JSON.stringify(response.data);
       }


       // Telegram message limit is 4096 characters
       if (responseText.length > 4000) {
         responseText = responseText.substring(0, 4000) + "... (truncated)";
       }


       return await this.sendMessage(chatId, responseText);
     } finally {
       // Always clear querying flag
       await TelegramUser.updateOne(
         { telegramId: chatId },
         { isQuerying: false }
       );
     }
   } catch (error) {
     console.error("handleQuery error:", error);


     // Clear querying flag on error
     await TelegramUser.updateOne(
       { telegramId: chatId },
       { isQuerying: false }
     ).catch(() => {});


     if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
       return await this.sendMessage(
         chatId,
         "⏱️ The chatbot took too long to respond. Please try again."
       );
     }


     return await this.sendMessage(
       chatId,
       "❌ Error communicating with chatbot. Please try again later."
     );
   }
 }
}


module.exports = new TelegramService();






