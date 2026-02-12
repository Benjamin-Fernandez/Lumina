# Telegram Integration Setup Guide


This guide explains how to set up, run, and deploy the Lumina Telegram integration that allows users to interact with deployed chatbots through Telegram.


## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Architecture Overview](#architecture-overview)


---


## Prerequisites


### Required Software
| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | Backend runtime |
| npm | 9.x or higher | Package manager |
| MongoDB | 6.x or higher | Database (or Azure Cosmos DB) |
| ngrok | Latest | Local webhook testing |
| Git | Latest | Version control |


### Required Accounts
- **Telegram Account** - To create and manage the bot via @BotFather
- **Azure Account** (for production) - To deploy the backend and Azure Functions
- **MongoDB Atlas or Azure Cosmos DB** - For database hosting


### Environment Variables
Create a `.env` file in `Lumina/lumina-web-be/` with the following variables:


```env
# Server Configuration
PORT=8080
NODE_ENV=development


# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority


# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=<your-bot-token-from-botfather>
TELEGRAM_API_URL=https://api.telegram.org/bot


# Azure Configuration (for deployment)
AZURE_SUBSCRIPTION_ID=<your-azure-subscription-id>
AZURE_RESOURCE_GROUP=<your-resource-group>


# Frontend Origin (for CORS)
FRONTEND_ORIGIN=http://localhost:3000
```


---


## Initial Setup


### Step 1: Create a Telegram Bot via BotFather


1. Open Telegram and search for **@BotFather** (verified bot with blue checkmark)
2. Start a chat and send `/newbot`
3. Follow the prompts:
  - **Name**: Enter a display name (e.g., "Lumina Chatbot Hub")
  - **Username**: Enter a unique username ending in "bot" (e.g., "lumina_chatbot_hub_bot")
4. BotFather will respond with your **API Token**. Save this securely!
  ```
  Done! Congratulations on your new bot. You will find it at t.me/lumina_chatbot_hub_bot.
  Use this token to access the HTTP API:
  123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
  ```
5. **Configure bot commands** (optional but recommended):
  ```
  /setcommands
  ```
  Select your bot and paste:
  ```
  start - Welcome message and instructions
  list - List available chatbots
  help - Show help information
  ```


### Step 2: Install Dependencies


```bash
cd Lumina/lumina-web-be
npm install
```


### Step 3: Configure Environment Variables


1. Copy the `.env.example` to `.env` (or create `.env` from scratch)
2. Set `TELEGRAM_BOT_TOKEN` to the token from BotFather
3. Set `MONGODB_URI` to your MongoDB connection string


### Step 4: Verify Database Collections


The Telegram integration uses two collections:
- `plugins` - Stores chatbot configurations (includes `telegramSupport` and `telegramDisplayName` fields)
- `telegramusers` - Stores Telegram user state (selected plugin, query status)


These collections are created automatically when the first documents are inserted.


---


## Running Locally


### Step 1: Start the Backend Server


```bash
cd Lumina/lumina-web-be
npm start
```


Expected output:
```
HTTP listening on 8080
DB connected
```


### Step 2: Expose Local Server with ngrok


Telegram requires HTTPS webhooks. Use ngrok to create a public tunnel:


```bash
# Install ngrok if not installed
# macOS: brew install ngrok
# Or download from https://ngrok.com/download


# Start tunnel
ngrok http 8080
```


ngrok will display a public URL like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8080
```


### Step 3: Register Webhook with Telegram


Use curl to register your webhook (replace placeholders):


```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
 -H "Content-Type: application/json" \
 -d '{"url": "https://<ngrok-url>/api/telegram/webhook"}'
```


**Example:**
```bash
curl -X POST "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrSTUvwxYZ/setWebhook" \
 -H "Content-Type: application/json" \
 -d '{"url": "https://abc123.ngrok-free.app/api/telegram/webhook"}'
```


Expected response:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```


### Step 4: Verify Webhook Status


```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```


---


## Deployment


### Option A: Deploy to Azure App Service


1. **Create Azure App Service:**
  ```bash
  az webapp create --resource-group <rg-name> --plan <plan-name> --name lumina-backend --runtime "NODE:18-lts"
  ```


2. **Configure Environment Variables:**
  ```bash
  az webapp config appsettings set --resource-group <rg-name> --name lumina-backend --settings \
   MONGODB_URI="<your-connection-string>" \
   TELEGRAM_BOT_TOKEN="<your-bot-token>"
  ```


3. **Deploy the Code:**
  ```bash
  cd Lumina/lumina-web-be
  zip -r deploy.zip . -x "node_modules/*" -x ".git/*"
  az webapp deploy --resource-group <rg-name> --name lumina-backend --src-path deploy.zip
  ```


4. **Register Production Webhook:**
  ```bash
  curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
   -H "Content-Type: application/json" \
   -d '{"url": "https://lumina-backend.azurewebsites.net/api/telegram/webhook"}'
  ```


### Option B: Deploy to Docker


1. **Create Dockerfile** in `Lumina/lumina-web-be/`:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 8080
  CMD ["node", "index.js"]
  ```


2. **Build and Run:**
  ```bash
  docker build -t lumina-backend .
  docker run -p 8080:8080 --env-file .env lumina-backend
  ```


---


## Testing


### Test Commands


Once the webhook is registered, open your Telegram bot and test the following:


| Command | Expected Response |
|---------|-------------------|
| `/start` | Welcome message with instructions |
| `/help` | Help text explaining available commands |
| `/list` | List of chatbots with Telegram support enabled |
| Select a chatbot | Confirmation message showing selected chatbot |
| Send a message | Response from the selected chatbot |


### Step-by-Step Test Procedure


1. **Prerequisite**: Deploy at least one plugin with `telegramSupport: true` via the Lumina frontend


2. **Test `/start` command:**
  - Send `/start` to your bot
  - Expected: Welcome message with instructions


3. **Test `/list` command:**
  - Send `/list` to your bot
  - Expected: List of available chatbots as inline buttons
  - If no chatbots: "No chatbots available" message


4. **Test chatbot selection:**
  - Click a chatbot button from the `/list` response
  - Expected: "You've selected [chatbot name]" confirmation


5. **Test query forwarding:**
  - Send any text message (e.g., "Hello, what can you do?")
  - Expected: Response from the Azure Function chatbot


### Quick Access Deep Links


Generate a deep link for users to select a specific chatbot directly:
```
https://t.me/<bot_username>?start=<plugin_id>
```


Example:
```
https://t.me/lumina_chatbot_hub_bot?start=65abc123def456
```


### API Health Check


Verify the Telegram endpoint is healthy:
```bash
curl https://<your-domain>/api/telegram/health
```
Expected: `{"status":"ok","service":"telegram"}`


---


## Troubleshooting


### Common Issues


#### 1. Webhook Not Receiving Messages


**Symptoms:** Bot doesn't respond to any messages


**Solutions:**
- Verify webhook is set: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"`
- Check webhook URL is correct and HTTPS
- Ensure ngrok is running (for local development)
- Check server logs for incoming requests
- Verify firewall allows incoming connections on port 8080


#### 2. Bot Returns "No chatbots available"


**Symptoms:** `/list` shows no chatbots


**Solutions:**
- Verify plugins exist with `telegramSupport: true` in the database
- Check MongoDB connection is established
- Ensure plugins are deployed (not just created)


#### 3. "You haven't selected a chatbot yet" Error


**Symptoms:** Queries return selection error


**Solutions:**
- User needs to run `/list` and select a chatbot first
- Check `telegramusers` collection for user state
- Clear user state and re-select: User can run `/list` again


#### 4. Query Timeout / No Response


**Symptoms:** Bot acknowledges but doesn't return chatbot response


**Solutions:**
- Check the Azure Function chatbot is running
- Verify the plugin's `functionEndpoint` is accessible
- Check network connectivity from backend to Azure Functions
- Review server logs for axios errors
- Ensure the chatbot endpoint responds within 30 seconds


#### 5. "Bot token not configured" Error


**Symptoms:** Health check fails or webhook returns 500


**Solutions:**
- Set `TELEGRAM_BOT_TOKEN` in `.env` file
- Restart the server after changing environment variables
- Verify token is correct (no extra spaces or characters)


#### 6. Database Connection Issues


**Symptoms:** Server starts but operations fail


**Solutions:**
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas/Cosmos DB
- Test connection with MongoDB Compass
- Check for network/firewall issues


### Debug Mode


Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=telegram:*
```


### View Telegram Webhook Errors


Check for webhook delivery errors:
```bash
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo" | jq
```


Look for:
- `last_error_date` - Timestamp of last error
- `last_error_message` - Error description
- `pending_update_count` - Number of pending updates


### Reset Webhook


If experiencing persistent issues, reset the webhook:
```bash
# Delete existing webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"


# Set new webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
 -H "Content-Type: application/json" \
 -d '{"url": "https://<your-domain>/api/telegram/webhook", "drop_pending_updates": true}'
```


---


## Architecture Overview


### System Components


```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Telegram      │     │   Lumina         │     │   Azure Functions   │
│   User          │────▶│   Backend        │────▶│   (Chatbots)        │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
       │                       │                         │
       │                       ▼                         │
       │               ┌──────────────┐                  │
       │               │   MongoDB    │                  │
       │               │  - plugins   │                  │
       │               │  - telegramusers │              │
       │               └──────────────┘                  │
       │                       ▲                         │
       └───────────────────────┴─────────────────────────┘
```


### Message Flow


```
1. User sends message to Telegram bot
        │
        ▼
2. Telegram API sends webhook POST to /api/telegram/webhook
        │
        ▼
3. Backend returns 200 OK immediately (prevents timeout)
        │
        ▼
4. TelegramService processes message asynchronously:
  ┌────────────────────────────────────────────┐
  │ Is it a command? (/start, /list, /help)   │
  │   YES → Execute command handler            │
  │   NO  → Forward to selected chatbot        │
  └────────────────────────────────────────────┘
        │
        ▼
5. For query forwarding:
  a. Look up user's selected plugin from telegramusers
  b. Get plugin's Azure Function endpoint
  c. POST query to Azure Function
  d. Receive response from chatbot
        │
        ▼
6. Send response back to user via Telegram Bot API
```


### Key Files


| File | Purpose |
|------|---------|
| `routes/telegram.route.js` | Express routes for webhook endpoint |
| `controllers/telegram.controller.js` | Request handling, immediate 200 response |
| `services/telegramService.js` | Core message routing and Telegram API calls |
| `models/telegramUser.model.js` | User state persistence (selected plugin) |
| `models/plugin.model.js` | Plugin schema with Telegram fields |


### API Endpoints


| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/telegram/webhook` | Receives Telegram updates |
| GET | `/api/telegram/health` | Health check endpoint |


---


## Additional Resources


- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [BotFather Commands Reference](https://core.telegram.org/bots#botfather)
- [Telegram Webhooks Guide](https://core.telegram.org/bots/webhooks)
- [ngrok Documentation](https://ngrok.com/docs)


---


*Guide last updated: 2026-02-12*






