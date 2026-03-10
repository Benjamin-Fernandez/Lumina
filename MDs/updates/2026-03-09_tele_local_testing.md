# Telegram Integration — Local Testing Guide

> Each time you develop or test the Telegram bot locally, follow these steps.
> ngrok URLs change every session, so the webhook must be re-registered each time.

---

## Bot Details

| Field | Value |
|-------|-------|
| **Bot Name** | lumina-test-1 |
| **Bot Username** | @lumina_test_1_bot |
| **Telegram Link** | <https://t.me/lumina_test_1_bot> |
| **Bot Token** | `8432565561:AAGqobgOhM3tVQwWo-ztSjYrB5t-19S67Vw` |

---

## Prerequisites

| Requirement | Install / Check |
|-------------|----------------|
| **Node.js** (≥18) | `node -v` |
| **npm dependencies** | `cd Lumina/lumina-web-be` then `npm install` |
| **ngrok** | Download from <https://ngrok.com/download> and add to PATH |
| **Telegram Bot Token** | Already in `Lumina/lumina-web-be/.env` as `TELEGRAM_BOT_TOKEN` |

### `.env` keys required

```env
TELEGRAM_BOT_TOKEN=8432565561:AAGqobgOhM3tVQwWo-ztSjYrB5t-19S67Vw
TELEGRAM_API_URL=https://api.telegram.org/bot
```

---

## Step 1 — Start the Backend Server

```bash
cd Lumina/lumina-web-be
npm start          # or: node index.js
```

You should see:

```
Server running on port 3001
MongoDB connected
```

Leave this terminal running.

---

## Step 2 — Start ngrok

In a **second terminal**:

```bash
ngrok http 3001
```

Copy the **HTTPS** forwarding URL, e.g. `https://abcd-1234.ngrok-free.app`.

> ⚠️ The free tier URL changes every time you restart ngrok.

---

## Step 3 — Register / Update the Webhook

Replace `<NGROK_URL>` with the HTTPS URL from Step 2.

**PowerShell** (use `Invoke-RestMethod` — PowerShell's `curl` alias doesn't support `-H`/`-d` flags):

```powershell
Invoke-RestMethod -Uri "https://api.telegram.org/bot8432565561:AAGqobgOhM3tVQwWo-ztSjYrB5t-19S67Vw/setWebhook" -Method POST -ContentType "application/json" -Body '{"url": "<NGROK_URL>/api/telegram/webhook"}'
```

**Bash / Git Bash / WSL:**

```bash
curl -X POST "https://api.telegram.org/bot8432565561:AAGqobgOhM3tVQwWo-ztSjYrB5t-19S67Vw/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "<NGROK_URL>/api/telegram/webhook"}'
```

✅ Expected response: `ok: True, result: True, description: Webhook was set`

### Verify webhook is set

```powershell
Invoke-RestMethod -Uri "https://api.telegram.org/bot8432565561:AAGqobgOhM3tVQwWo-ztSjYrB5t-19S67Vw/getWebhookInfo"
```

---

## Step 4 — Enable Telegram Support on a Plugin

At least one activated plugin must have `telegramSupport: true`.

**Option A — Via the web frontend:**  
Edit a plugin → toggle "Enable Telegram Support" on → save.

**Option B — Quick DB script:**

```bash
cd Lumina/lumina-web-be
node -e "
  require('dotenv').config();
  const mongoose = require('mongoose');
  const Plugin   = require('./models/plugin.model');
  (async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const p = await Plugin.findOne({ activated: true });
    if (p) { p.telegramSupport = true; p.telegramDisplayName = p.name; await p.save(); console.log('Enabled for:', p.name); }
    else   { console.log('No active plugins'); }
    await mongoose.disconnect();
  })();
"
```

---

## Step 5 — Test the Bot

1. Open Telegram → search for **@lumina_test_1_bot** (or go to <https://t.me/lumina_test_1_bot>).
2. Send `/start` → Welcome message.
3. Send `/list` → Shows plugins with Telegram support enabled.
4. Tap a plugin button (or send `/select <number>`) → Selects the chatbot.
5. Send any message → Forwarded to the plugin endpoint; response appears in chat.
6. Send `/help` → Lists available commands.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **Bot doesn't respond at all** | Check backend terminal for errors; verify ngrok is running and webhook URL matches |
| **`/list` shows no chatbots** | Run the enable script above or toggle Telegram support in the web frontend |
| **"Webhook was not set"** | Re-run the `setWebhook` curl with the current ngrok URL |
| **ngrok says "Tunnel session expired"** | Restart ngrok and re-register the webhook (Step 2 + 3) |
| **Timeout / no response from plugin** | The plugin endpoint may be down — check the plugin's `endpoint` + `path` in the DB |
| **"Selected chatbot is no longer available"** | The plugin was deactivated or Telegram support was turned off — re-enable it |
| **Port 3001 already in use** | Kill the other process: `npx kill-port 3001` or change `PORT` in `.env` |

---

## Quick-Reference Commands (PowerShell)

```powershell
# Check webhook status
Invoke-RestMethod -Uri "https://api.telegram.org/bot8432565561:AAGqobgOhM3tVQwWo-ztSjYrB5t-19S67Vw/getWebhookInfo"

# Remove webhook (stop receiving updates)
Invoke-RestMethod -Uri "https://api.telegram.org/bot8432565561:AAGqobgOhM3tVQwWo-ztSjYrB5t-19S67Vw/deleteWebhook" -Method POST

# Health check
Invoke-RestMethod -Uri "http://localhost:3001/api/telegram/health"
```

