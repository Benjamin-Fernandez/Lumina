# Telegram Bot Creation Research


## Executive Summary


**Can we programmatically create Telegram bots like we auto-deploy Azure Functions?**


**No.** Telegram does not provide any API for programmatic bot creation. Bots can only be created through the [@BotFather](https://t.me/botfather) conversational interface in the Telegram app.


## Research Findings


### 1. Bot Creation Methods


| Method | Available? | Details |
|--------|-----------|---------|
| Bot API Endpoint | ❌ No | The Telegram Bot API only provides methods for interacting with an existing bot, not creating new ones |
| BotFather API | ❌ No | BotFather is itself a Telegram bot and cannot be automated via API |
| Telegram MTProto API | ❌ No | While MTProto allows programmatic messaging, bot creation requires human verification |
| Direct API Call | ❌ No | No endpoint exists like `POST /createBot` |


### 2. What the Bot API DOES Support


The Telegram Bot API (documented at https://core.telegram.org/bots/api) provides:
- Sending/receiving messages
- Webhook management (`setWebhook`, `deleteWebhook`, `getWebhookInfo`)
- Updating bot profile (`setMyProfilePhoto`, `removeMyProfilePhoto` - as of API 9.4)
- Setting commands (`setMyCommands`)
- Managing chat members, stickers, payments, etc.


### 3. Bot Creation Process (Manual Only)


1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Provide a display name (e.g., "Lumina Chatbot")
4. Provide a username (must end in "bot", e.g., "lumina_chatbot_bot")
5. BotFather returns an API token
6. Optionally configure with `/setdescription`, `/setcommands`, `/setuserpic`


## Architecture Options


### Option A: Shared Bot (Current Implementation) ✅ RECOMMENDED


**Description:** One Lumina bot handles all deployed chatbots. Users select which chatbot to talk to via `/list` command.


**Pros:**
- ✅ No manual bot creation needed per developer
- ✅ Single webhook endpoint to maintain
- ✅ Centralized management and monitoring
- ✅ Users only need to find one bot
- ✅ Simpler deployment and updates


**Cons:**
- ❌ All chatbots share the same bot identity/name
- ❌ Rate limits shared across all chatbots
- ❌ Single point of failure
- ❌ Less branding customization per developer


### Option B: Individual Bots per Developer


**Description:** Each developer creates their own Telegram bot and provides the token.


**Pros:**
- ✅ Custom bot name and branding per developer
- ✅ Isolated rate limits
- ✅ Independent failure domains


**Cons:**
- ❌ Requires manual bot creation via BotFather for each developer
- ❌ Developers must manage their own bot tokens securely
- ❌ Multiple webhook endpoints to maintain
- ❌ More complex deployment process
- ❌ Users need to find each developer's bot separately


### Option C: Individual Bots per Plugin


**Description:** Each plugin gets its own Telegram bot.


**Pros:**
- ✅ Maximum branding customization
- ✅ Isolated environments


**Cons:**
- ❌ Requires manual bot creation for EVERY plugin
- ❌ Extremely high management overhead
- ❌ Poor user discovery experience
- ❌ Not scalable


## Recommendation


**Use Option A (Shared Bot)** for the following reasons:


1. **Zero friction** - Developers don't need to create Telegram bots
2. **Simpler architecture** - Single webhook, single bot token
3. **Better discovery** - Users find one bot and can access all chatbots
4. **Current implementation** - Already implemented in the chatbot-middleware


### Enhancement Possibilities


Even with a shared bot, we can improve the experience:


1. **Custom Display Names** - Already implemented via `telegramDisplayName` field
2. **Plugin Descriptions** - Show in `/list` command
3. **Quick Access Links** - Generate `t.me/LuminaBot?start=<pluginId>` deep links
4. **Plugin Categories** - Group chatbots in the selection menu


## Workarounds Considered


### Workaround 1: Telegram User API (MTProto)
Some libraries (like Telethon, Pyrogram) allow automation of user accounts, but:
- Violates Telegram ToS for automation
- Requires user authentication (phone number + verification code)
- Account may be banned


### Workaround 2: Pre-created Bot Pool
Pre-create a pool of bots and assign them to developers on demand:
- Still requires manual creation of each bot
- Complex management of bot pool
- Not scalable


## Conclusion


Programmatic bot creation is **not possible** with Telegram's current architecture. The **shared bot approach** is the recommended solution and is already implemented in the current Telegram integration.


---


*Research completed: 2026-02-12*
*Sources: Telegram Bot API documentation, Stack Overflow, Telegram developer community*






