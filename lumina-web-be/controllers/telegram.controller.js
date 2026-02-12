/**
* Telegram Controller
* Handles Telegram webhook requests
*
* This controller receives webhook updates from Telegram and delegates
* processing to the telegramService.
*/


const telegramService = require("../services/telegramService");


/**
* POST /api/telegram/webhook
* Receives Telegram webhook updates
*
* Important: Always return 200 OK immediately to prevent Telegram from retrying.
* Message processing happens asynchronously.
*/
exports.handleWebhook = async (req, res) => {
 try {
   // Telegram expects 200 OK response immediately
   const payload = req.body;


   // Validate payload has required fields
   if (!payload || (!payload.message && !payload.callback_query)) {
     return res.status(200).json({ ok: true });
   }


   // Process message asynchronously (don't await - respond immediately)
   telegramService.processMessage(payload).catch((err) => {
     console.error("Telegram webhook processing error:", err);
   });


   // Always return 200 to Telegram
   return res.status(200).json({ ok: true });
 } catch (error) {
   console.error("Webhook error:", error);
   // Still return 200 to prevent Telegram from retrying
   return res.status(200).json({ ok: true });
 }
};


/**
* GET /api/telegram/health
* Health check for Telegram integration
*/
exports.healthCheck = async (req, res) => {
 const botToken = process.env.TELEGRAM_BOT_TOKEN;
 return res.status(200).json({
   status: "ok",
   telegramConfigured: !!botToken,
   timestamp: new Date().toISOString(),
 });
};






