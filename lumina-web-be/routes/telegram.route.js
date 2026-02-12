/**
* Telegram Routes
* Handles Telegram Bot webhook and health endpoints
*
* Endpoints:
* - POST /api/telegram/webhook - Telegram webhook receiver
* - GET /api/telegram/health - Health check endpoint
*/


const express = require("express");
const router = express.Router();
const telegramController = require("../controllers/telegram.controller");


/**
* POST /api/telegram/webhook
* Telegram webhook endpoint - receives updates from Telegram Bot API
* No authentication required (Telegram-only access)
*/
router.post("/webhook", telegramController.handleWebhook);


/**
* GET /api/telegram/health
* Health check endpoint for monitoring Telegram integration status
*/
router.get("/health", telegramController.healthCheck);


module.exports = router;






