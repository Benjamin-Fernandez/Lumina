# Telegram Integration for the Lumina Platform


## A Technical Report Chapter on Extending the Chatbot Ecosystem to Telegram


---


**Document Type:** Final Year Project Technical Report – Chapter
**Project Title:** Lumina – An Open Innovation Ecosystem for Scalable and Evolutional Educational Mobile Chatbot
**Feature:** Telegram Bot Integration
**Implementation Date:** February 2026


---


## Table of Contents

1. [Introduction](#1-introduction)
2. [Motivation](#2-motivation)
3. [Architecture & Design](#3-architecture--design)
4. [Implementation Details](#4-implementation-details)
5. [Message Flow](#5-message-flow)
6. [Key Features](#6-key-features)
7. [Configuration & Setup](#7-configuration--setup)
8. [Technical Challenges & Solutions](#8-technical-challenges--solutions)
9. [Testing & Validation](#9-testing--validation)
10. [Future Enhancements](#10-future-enhancements)


---


## 1. Introduction


### 1.1 Overview

The Telegram integration extends the Lumina chatbot ecosystem beyond the native mobile application by enabling users to interact with deployed AI chatbots through Telegram, one of the world's most widely used messaging platforms. This feature introduces a shared Telegram bot architecture whereby a single Lumina-managed Telegram bot serves as a unified gateway to all developer-deployed chatbots that have opted in for Telegram support.

Through a webhook-based design, incoming Telegram messages are received by the Lumina backend, routed to the appropriate Azure Function chatbot endpoint, and the response is relayed back to the user within the Telegram conversation. Developers can opt their plugins into Telegram access via a simple toggle in the plugin creation wizard, requiring no additional infrastructure or Telegram-specific development effort.


### 1.2 Scope

This chapter documents the end-to-end design and implementation of the Telegram integration, covering:

- The shared bot architecture and its rationale
- Backend service layer, database schema changes, and API endpoints
- Frontend modifications to the plugin creation workflow
- The complete message flow from Telegram users to Azure Function chatbots and back
- Configuration, testing, and deployment procedures


---


## 2. Motivation


### 2.1 Problem Statement

The Lumina mobile application serves as the primary interface for students to access AI chatbots. However, this approach introduces several constraints:

1. **Installation Barrier:** Users must download and install the Lumina mobile application before accessing any chatbot
2. **Platform Dependency:** Access is limited to the Lumina app, which may not be the user's preferred messaging environment
3. **Discovery Limitation:** Potential users who are unaware of the Lumina app cannot discover available chatbots through their existing communication channels

### 2.2 Benefits of Telegram Integration

| Benefit | Description |
|---------|-------------|
| **Reduced Friction** | Users can interact with chatbots directly within Telegram without installing a separate application |
| **Wider Reach** | Telegram's large user base provides an additional distribution channel for deployed chatbots |
| **Familiar Interface** | Users interact through a messaging platform they already know and use daily |
| **Zero Developer Effort** | Developers enable Telegram access via a single toggle — no Telegram Bot API knowledge required |
| **Cross-Platform Access** | Telegram is available on mobile, desktop, and web, extending chatbot access to all form factors |

### 2.3 Design Rationale — Shared Bot Architecture

A key architectural decision was the adoption of a **shared bot model**, in which a single Telegram bot managed by the Lumina platform handles all chatbot interactions, rather than creating individual Telegram bots per plugin. This decision was driven by:

1. **Telegram API Limitation:** The Telegram Bot API does not support programmatic bot creation; each bot must be manually created through @BotFather. A per-plugin bot model would not scale.
2. **Simplified Management:** A single bot token, webhook endpoint, and operational configuration reduces infrastructure complexity.
3. **Consistent User Experience:** Users interact with one bot and select from available chatbots, providing a unified and predictable experience.
4. **Developer Simplicity:** Developers do not need to manage Telegram bot credentials or understand the Telegram Bot API.


---


## 3. Architecture & Design


### 3.1 High-Level Architecture

The Telegram integration introduces a new service layer within the existing Lumina backend (`lumina-web-be`) that bridges Telegram's Bot API with the platform's plugin infrastructure and Azure Function chatbot endpoints.

![Figure 1: Telegram Integration Architecture](placeholder_architecture_diagram.png)
*Caption: High-level architecture diagram showing the flow from Telegram users through the Lumina backend to Azure Function chatbot endpoints, with MongoDB as the persistence layer.*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LUMINA PLATFORM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────────┐     ┌─────────────────────────┐  │
│  │   Lumina     │────▶│  Telegram Bot    │────▶│   Azure Function        │  │
│  │   Frontend   │     │  Service (New)   │     │   (Deployed Chatbot)    │  │
│  │              │     │                  │     │                         │  │
│  │ - Toggle     │     │ - Webhook recv   │     │ - /api/http_trigger     │  │
│  │   Telegram   │     │ - Command handle │     │ - Query processing      │  │
│  │   Support    │     │ - Message route  │     │                         │  │
│  └──────────────┘     └──────────────────┘     └─────────────────────────┘  │
│         │                     │                          │                   │
│         ▼                     ▼                          │                   │
│  ┌──────────────────────────────────────────────────────┐│                   │
│  │                     MongoDB                          ││                   │
│  │  ┌─────────────────┐  ┌───────────────────────────┐ ││                   │
│  │  │    plugins       │  │    telegramusers (New)    │ ││                   │
│  │  │  Collection      │  │      Collection          │ ││                   │
│  │  │ + telegramSupport│  │ - telegramId (indexed)   │ ││                   │
│  │  │ + telegramDisplay│  │ - selectedPluginId       │ ││                   │
│  │  │   Name           │  │ - isQuerying             │ ││                   │
│  │  └─────────────────┘  └───────────────────────────┘ ││                   │
│  └──────────────────────────────────────────────────────┘│                   │
│                                                          │                   │
└──────────────────────────────────────────────────────────┴───────────────────┘
                             │
                             │ Telegram Bot API
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TELEGRAM                                             │
│  ┌─────────────┐                     ┌─────────────────────────────────────┐│
│  │  End User   │◀───────────────────▶│   Telegram Bot API                  ││
│  │  (Mobile/   │                     │   api.telegram.org                  ││
│  │   Desktop)  │                     │                                     ││
│  └─────────────┘                     └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```


### 3.2 Component Overview

The integration introduces four new backend files and modifies three existing files, while adding a UI toggle on the frontend:

| Layer | Component | Type | Purpose |
|-------|-----------|------|---------|
| Backend | `telegramService.js` | New | Core message handling, command routing, query forwarding |
| Backend | `telegram.controller.js` | New | Webhook endpoint controller; immediate 200 OK response |
| Backend | `telegram.route.js` | New | Express route definitions for webhook and health check |
| Backend | `telegramUser.model.js` | New | Mongoose model for Telegram user state |
| Backend | `plugin.model.js` | Modified | Added `telegramSupport` and `telegramDisplayName` fields |
| Backend | `deploy.controller.js` | Modified | Handles Telegram fields during managed deployment |
| Backend | `index.js` | Modified | Registers Telegram routes |
| Frontend | `PluginDetailsForm.jsx` | Modified | Telegram toggle switch and display name input |
| Frontend | `Create.jsx` | Modified | State management and API integration for Telegram fields |
| Frontend | `ReviewForm.jsx` | Modified | Displays Telegram settings in review step |


### 3.3 Design Principles

The integration was designed with the following principles:

1. **Non-Intrusive:** The Telegram feature is entirely opt-in. Existing plugins and workflows are unaffected.
2. **Asynchronous Processing:** Webhook handlers return HTTP 200 immediately to Telegram, then process messages asynchronously to prevent timeout retries.
3. **Stateful User Sessions:** Each Telegram user's selected chatbot is persisted in MongoDB, enabling seamless multi-turn conversations.
4. **Graceful Degradation:** If a selected chatbot becomes unavailable, the user is informed and prompted to select another.


---


## 4. Implementation Details


### 4.1 Backend Components

The backend implementation follows the existing Lumina `lumina-web-be` project structure, with clear separation of concerns across models, services, controllers, and routes.


#### 4.1.1 Telegram Service (`lumina-web-be/services/telegramService.js`)

The `TelegramService` class is the core of the integration, responsible for:

- **Payload Parsing:** Extracting `chatId`, `text`, and `callbackData` from incoming Telegram webhook payloads (both message and callback query types)
- **Command Routing:** Dispatching to the appropriate handler based on message content (`/start`, `/list`, `/help`, chatbot selection callbacks, or free-text queries)
- **Telegram API Communication:** Sending responses via the Telegram Bot API's `sendMessage` endpoint using `axios`
- **Query Forwarding:** Constructing the full chatbot endpoint URL (`plugin.endpoint + plugin.path`), forwarding user queries as `POST` requests with a 30-second timeout, and parsing the response

The service is exported as a singleton instance:

```javascript
const TelegramService = require("../services/telegramService");
// Exported as: module.exports = new TelegramService();
```

Key design decisions in the service include:

| Decision | Rationale |
|----------|-----------|
| Singleton pattern | Single instance manages all state; aligns with shared bot model |
| 30-second query timeout | Balances user experience with Azure Function cold-start latency |
| `isQuerying` flag | Prevents concurrent queries per user, avoiding race conditions |
| Response truncation at 4,000 chars | Telegram's message limit is 4,096 characters; truncation with `... (truncated)` suffix provides safety margin |


#### 4.1.2 Telegram Controller (`lumina-web-be/controllers/telegram.controller.js`)

The controller exposes two endpoints:

```javascript
// POST /api/telegram/webhook — Receives Telegram webhook updates
exports.handleWebhook = async (req, res) => {
  // Validate payload, then process asynchronously
  telegramService.processMessage(payload).catch((err) => {
    console.error("Telegram webhook processing error:", err);
  });
  // Always return 200 to Telegram immediately
  return res.status(200).json({ ok: true });
};

// GET /api/telegram/health — Health check
exports.healthCheck = async (req, res) => {
  return res.status(200).json({
    status: "ok",
    telegramConfigured: !!process.env.TELEGRAM_BOT_TOKEN,
  });
};
```

The critical design pattern here is the **fire-and-forget** approach: the webhook handler returns HTTP 200 to Telegram immediately, then processes the message asynchronously. This prevents Telegram from retrying delivery due to timeout, which would cause duplicate message processing.


#### 4.1.3 Telegram Routes (`lumina-web-be/routes/telegram.route.js`)

```javascript
router.post("/webhook", telegramController.handleWebhook);
router.get("/health", telegramController.healthCheck);
```

Routes are registered in `lumina-web-be/index.js`:

```javascript
app.use("/api/telegram", require("./routes/telegram.route"));
```


#### 4.1.4 Telegram User Model (`lumina-web-be/models/telegramUser.model.js`)

The `TelegramUser` model persists per-user session state:

```javascript
const TelegramUserSchema = mongoose.Schema({
  telegramId: { type: String, required: true, unique: true, index: true },
  selectedPluginId: { type: mongoose.Schema.Types.ObjectId, ref: "Plugin", default: null },
  isQuerying: { type: Boolean, default: false },
  lastActivity: { type: Date, default: Date.now },
}, { timestamps: true });
```


### 4.2 Database Schema Changes

#### 4.2.1 Modified Collection: `plugins`

Two new fields were added to the existing `Plugin` schema in `lumina-web-be/models/plugin.model.js`:

| Field | Type | Default | Max Length | Description |
|-------|------|---------|------------|-------------|
| `telegramSupport` | Boolean | `false` | — | Enables Telegram access for this plugin |
| `telegramDisplayName` | String | — | 32 | Custom name displayed in Telegram `/list` output; defaults to `name` if not provided |

**Migration Strategy:** No data migration was required. The new fields have defaults (`false` and `undefined` respectively), so existing plugins are unaffected and implicitly have Telegram support disabled.


#### 4.2.2 New Collection: `telegramusers`

![Figure 2: Database Schema — telegramusers Collection](placeholder_db_schema_diagram.png)
*Caption: Entity-relationship diagram showing the telegramusers collection schema and its reference to the plugins collection via selectedPluginId.*

| Field | Type | Indexed | Description |
|-------|------|---------|-------------|
| `telegramId` | String | Yes (unique) | The Telegram user's numeric chat ID, stored as a string |
| `selectedPluginId` | ObjectId (ref: Plugin) | No | Reference to the currently selected plugin for this user |
| `isQuerying` | Boolean | No | Mutex flag preventing concurrent queries from the same user |
| `lastActivity` | Date | No | Timestamp of the user's most recent interaction |
| `createdAt` | Date | No | Mongoose automatic timestamp |
| `updatedAt` | Date | No | Mongoose automatic timestamp |

The `telegramId` field is indexed with a unique constraint for fast lookups during webhook processing.


### 4.3 Frontend Changes

#### 4.3.1 Plugin Details Form (`lumina-web-fe/src/components/create/PluginDetailsForm.jsx`)

A new "Telegram Integration" section was added to the plugin creation form with:

- A Material-UI `Switch` component for "Enable Telegram Support"
- A collapsible `TextField` for the optional custom display name (max 32 characters) with a character counter
- Descriptive helper text explaining the feature

```jsx
<FormControlLabel
  control={
    <Switch
      checked={telegramSupport}
      onChange={(e) => setTelegramSupport(e.target.checked)}
      name="telegramSupport"
    />
  }
  label="Enable Telegram Support"
/>
{telegramSupport && (
  <TextField
    label="Telegram Display Name (optional)"
    value={telegramDisplayName}
    onChange={(e) => setTelegramDisplayName(e.target.value)}
    helperText="Name shown in Telegram bot. Defaults to plugin name."
    inputProps={{ maxLength: 32 }}
  />
)}
```

#### 4.3.2 Create Screen (`lumina-web-fe/src/screens/developer/create/Create.jsx`)

- Added `telegramSupport` (boolean) and `telegramDisplayName` (string) state variables
- Included Telegram fields in the `pluginData` object for plugin creation
- Appended Telegram fields to `FormData` for managed deployment requests
- Passed Telegram props to `PluginDetailsForm` and `ReviewForm` components

#### 4.3.3 Review Form (`lumina-web-fe/src/components/create/ReviewForm.jsx`)

- Added a "Telegram Integration" section displaying:
  - Status chip (Enabled/Disabled with Telegram icon)
  - Display name (if provided)


### 4.4 Deployment Controller Modifications

In `lumina-web-be/controllers/deploy.controller.js`, the managed deployment handler was updated to extract and persist Telegram fields from the deployment request:

```javascript
// Handle Telegram support from request
if (req.body.telegramSupport !== undefined) {
  plugin.telegramSupport =
    req.body.telegramSupport === true || req.body.telegramSupport === "true";
}
if (req.body.telegramDisplayName) {
  plugin.telegramDisplayName = req.body.telegramDisplayName;
}
```

The boolean coercion (`=== true || === "true"`) accounts for `FormData` submissions where all values are transmitted as strings.


### 4.5 Summary of File Changes

| File Path | Lines Changed | Type |
|-----------|--------------|------|
| `lumina-web-be/models/telegramUser.model.js` | 45 | New |
| `lumina-web-be/services/telegramService.js` | 321 | New |
| `lumina-web-be/controllers/telegram.controller.js` | 53 | New |
| `lumina-web-be/routes/telegram.route.js` | 27 | New |
| `lumina-web-be/models/plugin.model.js` | +13 | Modified |
| `lumina-web-be/controllers/deploy.controller.js` | +7 | Modified |
| `lumina-web-be/index.js` | +1 | Modified |
| `lumina-web-fe/src/screens/developer/create/Create.jsx` | +15 | Modified |
| `lumina-web-fe/src/components/create/PluginDetailsForm.jsx` | +51 | Modified |
| `lumina-web-fe/src/components/create/ReviewForm.jsx` | +32 | Modified |


### 4.6 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/telegram/webhook` | None (Telegram-only) | Receives incoming Telegram webhook updates |
| GET | `/api/telegram/health` | None | Health check; reports whether bot token is configured |


---


## 5. Message Flow


### 5.1 End-to-End Message Flow

![Figure 3: Sequence Diagram — Telegram Message Flow](placeholder_sequence_diagram.png)
*Caption: Sequence diagram illustrating the complete message flow for a user query, from Telegram client through the Lumina backend to the Azure Function chatbot and back.*

The following describes the step-by-step flow when a Telegram user sends a query to a selected chatbot:

1. **User sends message** to the Lumina Telegram bot via the Telegram client (mobile, desktop, or web)
2. **Telegram API** delivers the message as an HTTP POST webhook to `https://<lumina-backend>/api/telegram/webhook`
3. **Telegram Controller** (`telegram.controller.js`) receives the request, validates the payload, and returns HTTP 200 OK immediately to Telegram
4. **Message Processing** begins asynchronously via `telegramService.processMessage(payload)`
5. **Payload Parsing** extracts `chatId` and `text` from the webhook body
6. **Command Routing** determines the handler:
   - `/start`, `/list`, `/help` → command handlers
   - Callback data starting with `select_` → selection handler
   - Free text → query handler
7. **Query Handler** (`handleQuery`):
   a. Looks up the user's `selectedPluginId` from the `telegramusers` collection
   b. Retrieves the plugin's endpoint and path from the `plugins` collection
   c. Sets `isQuerying = true` to prevent concurrent requests
   d. Sends a POST request to `${plugin.endpoint}${plugin.path}` with `{ query: userMessage }`
   e. Receives the chatbot response from the Azure Function
   f. Parses the response (handles string, `response` field, or `message` field formats)
   g. Truncates to 4,000 characters if necessary
   h. Sets `isQuerying = false`
8. **Response Delivery** via Telegram Bot API `sendMessage` to the user's `chatId`


### 5.2 Command Flow — `/list` and Chatbot Selection

```
Telegram User           Telegram API         Lumina Backend              MongoDB
   │                       │                      │                        │
   │  /list command        │                      │                        │
   │──────────────────────▶│  Webhook POST        │                        │
   │                       │─────────────────────▶│                        │
   │                       │                      │  Query plugins         │
   │                       │                      │  (activated=true,      │
   │                       │                      │   telegramSupport=true) │
   │                       │                      │───────────────────────▶│
   │                       │                      │  Plugin list           │
   │                       │                      │◀───────────────────────│
   │                       │  sendMessage          │                        │
   │                       │  (inline keyboard)    │                        │
   │                       │◀─────────────────────│                        │
   │  Chatbot buttons      │                      │                        │
   │◀──────────────────────│                      │                        │
   │                       │                      │                        │
   │  Click chatbot button │                      │                        │
   │──────────────────────▶│  Callback POST       │                        │
   │                       │─────────────────────▶│                        │
   │                       │                      │  Upsert TelegramUser   │
   │                       │                      │  (selectedPluginId)    │
   │                       │                      │───────────────────────▶│
   │  "✅ Selected!"       │                      │                        │
   │◀──────────────────────│◀─────────────────────│                        │
```

![Figure 4: Telegram Chat — /list Command Output](placeholder_telegram_list_screenshot.png)
*Caption: Screenshot of the Telegram chat interface showing the /list command output with inline keyboard buttons for available chatbots.*


### 5.3 Error Handling Flow

| Error Condition | Detection Point | User Message | System Action |
|-----------------|-----------------|--------------|---------------|
| Invalid/empty payload | Controller | (none) | Return 200, log warning |
| No chatbot selected | Query handler | "No chatbot selected. Use /list to choose a chatbot first." | — |
| Concurrent query | Query handler | "⏳ Please wait for the current query to complete." | — |
| Plugin not found or inactive | Query handler | "Selected chatbot is no longer available. Use /list to choose another." | — |
| Azure Function timeout | Query handler | "⏱️ The chatbot took too long to respond. Please try again." | Clear `isQuerying` flag |
| Azure Function error | Query handler | "❌ Error communicating with chatbot. Please try again later." | Clear `isQuerying` flag, log error |


---


## 6. Key Features


### 6.1 Bot Commands

The Lumina Telegram bot supports three slash commands, registered with @BotFather for discoverability:

| Command | Description | Handler Method |
|---------|-------------|----------------|
| `/start` | Displays a welcome message introducing the Lumina Chatbot Marketplace and listing available commands | `handleStart(chatId)` |
| `/list` | Queries the database for all plugins with `activated: true` and `telegramSupport: true`, then presents them as Telegram inline keyboard buttons | `handleList(chatId)` |
| `/help` | Shows a help message with command descriptions and usage instructions | `handleHelp(chatId)` |


### 6.2 Plugin Selection Mechanism

When a user taps a chatbot button from the `/list` output, Telegram sends a **callback query** with data in the format `select_<pluginId>`. The `handleSelect` method:

1. Extracts the `pluginId` from the callback data
2. Validates that the plugin exists, is activated, and has Telegram support enabled
3. Upserts the `TelegramUser` document with `selectedPluginId` set to the chosen plugin
4. Sends a confirmation message: "✅ [Display Name] selected! You can now start chatting."

The upsert pattern (`findOneAndUpdate` with `upsert: true`) ensures that both new and returning Telegram users are handled without separate creation logic.


### 6.3 Query Forwarding

Once a chatbot is selected, any free-text message (not starting with `/`) is treated as a query and forwarded to the selected plugin's Azure Function endpoint. The response parsing logic handles multiple response formats:

```javascript
if (typeof response.data === "string") {
  responseText = response.data;
} else if (response.data && response.data.response) {
  responseText = response.data.response;
} else if (response.data && response.data.message) {
  responseText = response.data.message;
} else {
  responseText = JSON.stringify(response.data);
}
```

This flexibility ensures compatibility with diverse chatbot response structures.

![Figure 5: Telegram Chat — Chatbot Conversation](placeholder_telegram_chat_screenshot.png)
*Caption: Screenshot of a Telegram conversation showing a user querying a selected chatbot and receiving a response.*


### 6.4 Concurrent Query Prevention

The `isQuerying` boolean flag in the `TelegramUser` document acts as a per-user mutex. When a query is in progress, subsequent messages receive the response "⏳ Please wait for the current query to complete." The flag is cleared in a `finally` block to ensure it is always reset, even if the chatbot request fails.


---


## 7. Configuration & Setup


### 7.1 Environment Variables

The following environment variables must be configured in the `lumina-web-be/.env` file:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | Yes | — | Bot API token obtained from @BotFather (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`) |
| `TELEGRAM_API_URL` | No | `https://api.telegram.org/bot` | Base URL for Telegram Bot API calls |


### 7.2 Bot Creation (One-Time)

1. Open Telegram and message **@BotFather**
2. Send `/newbot` and follow the prompts to set a display name and username
3. Save the API token provided by BotFather
4. Configure bot commands via `/setcommands`:
   ```
   start - Welcome message and instructions
   list - List available chatbots
   help - Show help information
   ```


### 7.3 Webhook Registration

After the backend is deployed and accessible via HTTPS, register the webhook with Telegram:

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://<your-domain>/api/telegram/webhook"}'
```

**Verification:**
```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

For local development, **ngrok** is used to create an HTTPS tunnel to the local backend:

```bash
ngrok http 8080
# Then register the ngrok URL as the webhook
```


### 7.4 Webhook Reset (Troubleshooting)

If persistent delivery issues occur, the webhook can be reset:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://<your-domain>/api/telegram/webhook", "drop_pending_updates": true}'
```


---


## 8. Technical Challenges & Solutions


### 8.1 Telegram Does Not Support Programmatic Bot Creation

**Challenge:** The initial design considered creating individual Telegram bots per plugin. Research revealed that the Telegram Bot API provides no mechanism for programmatic bot creation — all bots must be manually created through @BotFather.

**Solution:** Adopted the shared bot architecture, where one Lumina-managed bot serves as a gateway to all Telegram-enabled plugins. This constraint informed the entire architectural approach.


### 8.2 Webhook Timeout and Duplicate Messages

**Challenge:** Telegram retries webhook delivery if it does not receive an HTTP 200 response within a short window. If message processing (including Azure Function calls) takes longer than this window, Telegram would re-deliver the update, causing duplicate responses.

**Solution:** The controller returns HTTP 200 immediately and processes the message asynchronously using a fire-and-forget pattern:

```javascript
telegramService.processMessage(payload).catch((err) => {
  console.error("Telegram webhook processing error:", err);
});
return res.status(200).json({ ok: true });
```


### 8.3 FormData Boolean Coercion

**Challenge:** When the frontend sends deployment requests via `FormData` (required for file uploads), all values are serialised as strings. The `telegramSupport` field arrives as the string `"true"` rather than the boolean `true`.

**Solution:** The deployment controller explicitly checks for both types:

```javascript
plugin.telegramSupport =
  req.body.telegramSupport === true || req.body.telegramSupport === "true";
```


### 8.4 Concurrent Query Race Conditions

**Challenge:** Users sending multiple messages rapidly before receiving a response could trigger concurrent Azure Function requests, potentially causing out-of-order responses or resource exhaustion.

**Solution:** The `isQuerying` flag in the `TelegramUser` document serves as a lightweight mutex, rejecting subsequent queries while one is in progress. A `finally` block ensures the flag is always cleared.


---


## 9. Testing & Validation


### 9.1 Testing Approach

The Telegram integration was validated through a combination of manual end-to-end testing and structured test scenarios.


### 9.2 Test Procedure

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create a Telegram bot via @BotFather | Bot token received |
| 2 | Set `TELEGRAM_BOT_TOKEN` in backend `.env` | — |
| 3 | Start backend server (`npm start`) | "HTTP listening on 8080" and "DB connected" |
| 4 | Expose locally with ngrok (`ngrok http 8080`) | HTTPS URL generated |
| 5 | Register webhook with curl | `{"ok":true,"result":true,"description":"Webhook was set"}` |
| 6 | Deploy a plugin with Telegram support enabled via frontend | Plugin created with `telegramSupport: true` |
| 7 | Send `/start` to bot in Telegram | Welcome message received |
| 8 | Send `/list` to bot | Inline keyboard with deployed chatbot name |
| 9 | Click chatbot button | Confirmation: "✅ [Name] selected!" |
| 10 | Send a text query | Response from Azure Function chatbot |
| 11 | Send query without selecting a chatbot (new user) | "No chatbot selected" message |
| 12 | Send rapid successive messages | Second message returns "⏳ Please wait" |


### 9.3 Integration Test Scenarios

| Test Case | Components Exercised | Validation |
|-----------|---------------------|------------|
| Webhook receives `/start` | Route → Controller → Service → Telegram API | User receives welcome message |
| List with no enabled plugins | Service → MongoDB query | "No chatbots available" message |
| List with enabled plugins | Service → MongoDB → Telegram API (inline keyboard) | Buttons displayed with correct names |
| Select chatbot | Service → MongoDB upsert → Telegram API | TelegramUser document created, confirmation sent |
| Query forwarding | Service → MongoDB → Azure Function → Telegram API | Chatbot response delivered to user |
| Chatbot timeout | Service → Azure Function (30s timeout) | Timeout error message, `isQuerying` cleared |
| Health check | Route → Controller | `{"status":"ok","telegramConfigured":true}` |


### 9.4 Verification Commands

```bash
# Verify webhook status
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo" | jq

# Verify health endpoint
curl https://<your-domain>/api/telegram/health

# Check for webhook errors (look for last_error_date and last_error_message)
```


---


## 10. Future Enhancements

The following improvements have been identified for potential future development:

| Enhancement | Priority | Description |
|-------------|----------|-------------|
| **Deep Link Support** | High | Enable URLs in the format `t.me/bot?start=<pluginId>` to directly select a specific chatbot, bypassing the `/list` flow |
| **Inline Keyboard Navigation** | Medium | Replace numbered selection with paginated inline keyboards for better UX when many chatbots are available |
| **Plugin Categories in `/list`** | Medium | Group chatbots by category (Modules, Career, School, General) in the listing |
| **Rich Message Formatting** | Medium | Support Markdown or HTML formatting in chatbot responses via Telegram's `parse_mode` parameter |
| **Webhook Secret Token** | High | Implement Telegram's `secret_token` header validation for enhanced webhook security |
| **Analytics Dashboard** | Medium | Track per-chatbot Telegram usage metrics (queries, unique users, response times) |
| **Conversation History** | Low | Persist Telegram conversation history in MongoDB for context-aware multi-turn responses |
| **Multi-Bot Support** | Low | Allow developers to optionally link their own Telegram bots to their plugins |
| **Admin Commands** | Low | Enable developers to manage their chatbot status via Telegram commands |


---


## References

- Telegram Bot API Documentation: https://core.telegram.org/bots/api
- BotFather Commands Reference: https://core.telegram.org/bots#botfather
- Telegram Webhooks Guide: https://core.telegram.org/bots/webhooks
- Lumina Platform Technical Report (December 2025): `MDs/eval/report_1.md`
- Telegram Integration Plan: `MDs/updates/2026-07-01_tele_chat.md`
- Telegram Implementation Summary: `MDs/updates/2026-10-01_tele_overall.md`
- Telegram Setup Guide: `MDs/updates/2026-09-01_tele_setup_guide.md`


---


**End of Chapter**
