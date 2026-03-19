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
- [Build Process](#build-process)
- [Setup & Deployment Guide](#setup--deployment-guide)
- [Acknowledgments](#acknowledgments)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

Lumina is an Open Innovation Ecosystem that facilitates the integration of LLMs within NTU’s academic environment.

The ecosystem is built upon two interconnected applications: Lumina Web Portal, a web platform for plugin management and deployment, and Lumina Mobile, a mobile application that allows students to interact with all available optimised LLM plugins.

**Lumina Mobile is available for both iOS and Android.**

## Features

A few of the things you can do with Lumina:

**For Developers**

- <strong>Rapid Deployment: </strong> Connect optimized LLM backends to mobile frontend and deploy it within minutes ✨
- <strong>Centralized Management: </strong> View and manage your deployed LLMs on one portal 🔭
- <strong>Endpoint Testing: </strong>Test your LLM endpoints to make sure they are up and running! 💡

**For end-users**

- <strong>Discover Daily: </strong>Discover wide array of relevant fine-tuned chatbots 🤖
- <strong>Favourite for Quick Access: </strong>Favourite frequently used chatbots for easy access ❤️
- <strong>Conversation History: </strong>Review and manage conversation histories 📜
- <strong>GPT-4o-mini Model: </strong>General queries answered with base GPT-4o-mini model 💬

## Build Process

1. Git clone the repository

```
git clone https://github.com/yanxchi/Lumina.git

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

## Setup & Deployment Guide

For a comprehensive, step-by-step guide to setting up the entire Lumina ecosystem from scratch — including Azure infrastructure provisioning, environment configuration, production deployment, Telegram bot integration, and managed plugin deployment automation — see the full guide:

> 📘 **[End-to-End Setup Guide](end_to_end_setup_guide.md)**

### Quick-Start Overview

| Step | Description |
|------|-------------|
| **1. Clone the repository** | `git clone https://github.com/yanxchi/Lumina.git` |
| **2. Provision Azure resources** | Create Cosmos DB, Azure OpenAI, App Services, Static Web App, Storage Account, and Azure AD app registrations |
| **3. Configure environment variables** | Set up `.env` files for both backends and update `config.js` / `authConfig.js` for both frontends |
| **4. Run locally** | Start all four components with `npm install` and `npm run dev` / `npm start` / `npx expo start` |
| **5. Deploy to Azure** | Push to `main` to trigger GitHub Actions CI/CD for backends and Static Web App; use Expo EAS for mobile builds |
| **6. Set up Telegram (optional)** | Create a bot via @BotFather, configure the webhook, and enable Telegram support on plugins |

### What the Guide Covers

- **Azure Infrastructure** — Resource groups, Cosmos DB (MongoDB API), Azure OpenAI, App Services, Static Web Apps, Storage, Service Principals, and Azure AD app registrations
- **Configuration** — Complete environment variable reference for all four components (`lumina-web-be`, `Lumina-Mobile-BE`, `lumina-web-fe`, `Lumina-Mobile-FE`)
- **Local Development** — Dependency installation and startup instructions for each component
- **Production Deployment** — GitHub Actions CI/CD workflows, manual zip deploy, and Expo EAS build profiles
- **Telegram Bot Integration** — Bot creation, webhook registration, and local testing with ngrok
- **Managed Plugin Deployment** — How the automated Azure Function App deployment pipeline works
- **Troubleshooting** — Common issues, Azure log streaming, and debugging tips

## Acknowledgments

Special thanks to Mr. Ong Chin Ann for offering the opportunity to work on this project, providing invaluable guidance throughout the development process, sharing his expertise, and supervising this final year project. His consistent support, constructive feedback, and passion have been instrumental in shaping Lumina.
