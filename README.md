<h1 align="center"> Lumina </h1> <br>
<p align="center">
    <img alt="Lumina Web Portal" title="Lumina Web Portal" src="/assets/LuminaPortal.png" width="450">
    <img alt="Lumina Mobile" title="Lumina Mobile" src="/assets/LuminaMobile.PNG" width="150">

</p>

<p align="center">
<strong>
  An Open Innovation Ecosystem for Scalable and Evolutional Educational Mobile Chatbot 🚀
  </strong>
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Content

- [Introduction](#introduction)
- [Features](#features)
- [What's New](#whats-new)
- [Architecture Overview](#architecture-overview)
- [Build Process](#build-process)
- [Setup & Deployment Guide](#setup--deployment-guide)
- [Documentation & Reports](#documentation--reports)
- [Acknowledgments](#acknowledgments)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

Lumina is an Open Innovation Ecosystem that facilitates the integration of LLMs within NTU’s academic environment.

The ecosystem is built upon two interconnected applications: Lumina Web Portal, a web platform for plugin management and deployment, and Lumina Mobile, a mobile application that allows students to interact with all available optimised LLM plugins. As of 2026, the ecosystem also extends to **Telegram**, allowing students to chat with the same Lumina-hosted chatbots directly inside Telegram.

**Lumina Mobile is available for both iOS and Android.**

## Features

A few of the things you can do with Lumina:

**For Developers**

- <strong>Rapid Deployment: </strong> Connect optimized LLM backends to mobile frontend and deploy it within minutes ✨
- <strong>Managed Deployment (NEW): </strong> Upload an Azure Function zip directly through the portal and Lumina provisions and hosts the chatbot for you 📦
- <strong>Centralized Management: </strong> View and manage your deployed LLMs on one portal 🔭
- <strong>Endpoint Testing: </strong>Test your LLM endpoints to make sure they are up and running! 💡
- <strong>Flexible Integration: </strong>Custom endpoint paths, API Key / Bearer Token auth forwarding, and auto-generated OpenAPI 3.0 schemas 🔌
- <strong>Telegram Opt-In (NEW): </strong>Toggle Telegram support on any plugin to expose it through the shared Lumina Telegram bot 🤖

**For end-users**

- <strong>Discover Daily: </strong>Discover wide array of relevant fine-tuned chatbots 🤖
- <strong>Favourite for Quick Access: </strong>Favourite frequently used chatbots for easy access ❤️
- <strong>Conversation History: </strong>Review and manage conversation histories 📜
- <strong>GPT-4o-mini Model: </strong>General queries answered with base GPT-4o-mini model 💬
- <strong>Chat via Telegram (NEW): </strong>Use `/list` inside the Lumina Telegram bot to pick any Telegram-enabled chatbot and start chatting — no app install required 📲

## What's New

Recent contributions on top of the original 2025 platform (see [`MDs/eval/report_1.md`](MDs/eval/report_1.md) for the December 2025 baseline):

| Date | Contribution | Reference |
|------|--------------|-----------|
| Jan 2026 | **Managed Plugin Deployment** — `/api/deploy` route, `deploymentService.js`, drag-and-drop zip upload UI, and automated Azure Function App provisioning | [`MDs/updates/2026-04-01_deployment_automation.md`](MDs/updates/2026-04-01_deployment_automation.md) |
| Feb 2026 | **Telegram Bot Integration** — shared bot architecture, webhook receiver, `/start` `/list` `/help` commands, per-plugin `telegramSupport` toggle, new `telegramusers` collection | [`MDs/eval/report_telegram_integration.md`](MDs/eval/report_telegram_integration.md) |
| Mar 2026 | **End-to-End Setup Guide** consolidating Azure provisioning, env vars, CI/CD, Telegram setup, and managed deployment automation | [`MDs/eval/end_to_end_setup_guide.md`](MDs/eval/end_to_end_setup_guide.md) |
| 2026 | **Evaluation Forms** for chatbot developers and workshop attendees | [`MDs/eval/eval_dev.md`](MDs/eval/eval_dev.md), [`MDs/eval/eval_workshop.md`](MDs/eval/eval_workshop.md) |

Earlier improvements already in the baseline December 2025 report include dynamic endpoint paths (no longer hardcoded to `/getResponse`), API key / Bearer token forwarding via `requestInterceptor`, the 60-second Azure Timer Function sync between the web and mobile databases, and the structured plugin request/response logger.

## Architecture Overview

Lumina is a dual-interface ecosystem (mobile for students, web for developers) backed by shared Azure infrastructure. A third surface — the Lumina Telegram bot — was added in February 2026.

| Component | Directory | Stack | Default Port |
|-----------|-----------|-------|--------------|
| Web Frontend (Developer Portal) | `lumina-web-fe/` | React 18, MUI 6, MSAL | 3000 |
| Web Backend (Portal API + Telegram webhook + managed deploy) | `lumina-web-be/` | Node.js, Express 4, Mongoose | 8080 |
| Mobile Frontend (Student App) | `Lumina-Mobile-FE/` | React Native, Expo SDK 54, Expo Router | Expo |
| Mobile Backend (Mobile API + OpenAI proxy + plugin execution) | `Lumina-Mobile-BE/` | Node.js, Express 4, Mongoose | 3002 |
| Function App Template | `lumina-function/` | Azure Functions (Node.js) | — |

**Azure services used:** Cosmos DB (MongoDB API), Azure OpenAI (GPT-4o-mini), 2× App Service (backends), Static Web Apps (web frontend), Storage Account (deployment artifacts), Function Apps (managed plugin hosts), Blob Storage (plugin images), Entra ID (auth), and a Timer Function that syncs the web `plugins` collection to the mobile `chatbots` collection every 60 seconds.

For a detailed architecture and data-flow walkthrough, see [`MDs/eval/report_1.md`](MDs/eval/report_1.md) §2 and [`MDs/eval/report_telegram_integration.md`](MDs/eval/report_telegram_integration.md) §3.

## Build Process

1. Git clone the repository

```
git clone https://github.com/Benjamin-Fernandez/Lumina.git

cd Lumina
```

2. Navigate to the project directories and follow the following instructions:

```
# For Lumina Web Portal Front-End

cd lumina-web-fe

npm install

npm run start


# For Lumina Web Portal Back-End

cd lumina-web-be

npm install

npm run start


# For Lumina Mobile Front-End

cd Lumina-Mobile-FE

npm install

npx expo start


# For Lumina Mobile Back-end

cd Lumina-Mobile-BE

npm install

npm run start
```

3. For Lumina Mobile Front-End, download Expo GO from Google Playstore OR Apple App Store to preview the build.

> ⚠️ Before any component will run end-to-end you must populate the `.env` files for both backends and update `config.js` / `authConfig.js` for both frontends. See the [End-to-End Setup Guide](MDs/eval/end_to_end_setup_guide.md) §5 and §12 for the full environment-variable reference (Cosmos DB, Azure OpenAI, MSAL client IDs, Blob SAS token, `TELEGRAM_BOT_TOKEN`, etc.).

## Setup & Deployment Guide

For a comprehensive, step-by-step guide to setting up the entire Lumina ecosystem from scratch — including Azure infrastructure provisioning, environment configuration, production deployment, Telegram bot integration, and managed plugin deployment automation — see the full guide:

> 📘 **[End-to-End Setup Guide](MDs/eval/end_to_end_setup_guide.md)**

### Quick-Start Overview

| Step | Description |
|------|-------------|
| **1. Clone the repository** | `git clone https://github.com/Benjamin-Fernandez/Lumina.git` |
| **2. Provision Azure resources** | Cosmos DB, Azure OpenAI, 2× App Services, Static Web App, Storage Account, Service Principal, and Azure AD app registrations |
| **3. Configure environment variables** | Populate `.env` files for both backends and update `config.js` / `authConfig.js` for both frontends |
| **4. Run locally** | Start all four components with `npm install` and `npm run dev` / `npm start` / `npx expo start` |
| **5. Deploy to Azure** | Push to `main` to trigger GitHub Actions CI/CD for backends and Static Web App; use Expo EAS for mobile builds |
| **6. Set up Telegram** | Create a bot via @BotFather, set `TELEGRAM_BOT_TOKEN`, register the `/api/telegram/webhook` URL, and toggle Telegram support on each plugin you want exposed |
| **7. Enable Managed Deployment** | Configure the Service Principal + Storage Account so developers can upload Function App zips directly from the portal |

### What the Guide Covers

- **Azure Infrastructure** — Resource groups, Cosmos DB (MongoDB API), Azure OpenAI, App Services, Static Web Apps, Storage, Service Principals, and Azure AD app registrations
- **Configuration** — Complete environment variable reference for all four components (`lumina-web-be`, `Lumina-Mobile-BE`, `lumina-web-fe`, `Lumina-Mobile-FE`)
- **Local Development** — Dependency installation and startup instructions for each component
- **Production Deployment** — GitHub Actions CI/CD workflows, manual zip deploy, and Expo EAS build profiles
- **Telegram Bot Integration** — Bot creation, webhook registration, local testing with ngrok, and webhook reset / troubleshooting
- **Managed Plugin Deployment** — How the automated Azure Function App deployment pipeline works (`deploymentService.js`, multer upload, lifecycle management)
- **Troubleshooting** — Common issues, Azure log streaming, and debugging tips

## Documentation & Reports

All longer-form documentation lives under [`MDs/`](MDs/). The most useful entry points are:

| Document | Purpose |
|----------|---------|
| [`MDs/eval/end_to_end_setup_guide.md`](MDs/eval/end_to_end_setup_guide.md) | Authoritative, step-by-step setup & deployment guide (start here when onboarding) |
| [`MDs/eval/report_1.md`](MDs/eval/report_1.md) | December 2025 technical report — architecture, plugin system, resolved challenges |
| [`MDs/eval/report_telegram_integration.md`](MDs/eval/report_telegram_integration.md) | February 2026 chapter — Telegram integration architecture, message flow, and setup |
| [`MDs/eval/eval_dev.md`](MDs/eval/eval_dev.md) | Structured feedback form for third-party chatbot developers |
| [`MDs/eval/eval_workshop.md`](MDs/eval/eval_workshop.md) | Feedback form for workshop attendees |
| [`MDs/updates/`](MDs/updates/) | Dated implementation notes (system arch, bug fixes, integration plans, Telegram + deployment automation rollouts) |

## Acknowledgments

Special thanks to Mr. Ong Chin Ann for offering the opportunity to work on this project, providing invaluable guidance throughout the development process, sharing his expertise, and supervising this final year project. His consistent support, constructive feedback, and passion have been instrumental in shaping Lumina.
