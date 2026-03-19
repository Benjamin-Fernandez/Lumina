# Lumina Platform — End-to-End Setup Guide

---

> **Document Version:** 1.0
> **Last Updated:** 2026-03-19
> **Author:** Lumina Development Team
> **Prerequisites Summary:** Fresh Azure subscription, Git, Node.js 18+, npm 9+, Azure CLI, Expo CLI (for mobile), a Telegram account (optional, for bot integration)

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Prerequisites & Tooling](#2-prerequisites--tooling)
3. [Clone the Repository](#3-clone-the-repository)
4. [Azure Infrastructure Setup (From Scratch)](#4-azure-infrastructure-setup-from-scratch)
   - 4.1 [Install & Authenticate Azure CLI](#41-install--authenticate-azure-cli)
   - 4.2 [Create Resource Groups](#42-create-resource-groups)
   - 4.3 [Provision Azure Cosmos DB (MongoDB API)](#43-provision-azure-cosmos-db-mongodb-api)
   - 4.4 [Provision Azure OpenAI](#44-provision-azure-openai)
   - 4.5 [Create Azure App Service for Web Backend](#45-create-azure-app-service-for-web-backend)
   - 4.6 [Create Azure App Service for Mobile Backend](#46-create-azure-app-service-for-mobile-backend)
   - 4.7 [Create Azure Static Web App for Web Frontend](#47-create-azure-static-web-app-for-web-frontend)
   - 4.8 [Create Azure Storage Account (Deployment Artifacts)](#48-create-azure-storage-account-deployment-artifacts)
   - 4.9 [Create Service Principal for Deployment Automation](#49-create-service-principal-for-deployment-automation)
   - 4.10 [Register Azure AD App Registrations (Authentication)](#410-register-azure-ad-app-registrations-authentication)
5. [Component Configuration & Environment Variables](#5-component-configuration--environment-variables)
   - 5.1 [Lumina Web Backend (`lumina-web-be`)](#51-lumina-web-backend-lumina-web-be)
   - 5.2 [Lumina Mobile Backend (`Lumina-Mobile-BE`)](#52-lumina-mobile-backend-lumina-mobile-be)
   - 5.3 [Lumina Web Frontend (`lumina-web-fe`)](#53-lumina-web-frontend-lumina-web-fe)
   - 5.4 [Lumina Mobile Frontend (`Lumina-Mobile-FE`)](#54-lumina-mobile-frontend-lumina-mobile-fe)
6. [Local Development Setup](#6-local-development-setup)
7. [Production Deployment](#7-production-deployment)
   - 7.1 [Deploy Web Backend to Azure App Service](#71-deploy-web-backend-to-azure-app-service)
   - 7.2 [Deploy Mobile Backend to Azure App Service](#72-deploy-mobile-backend-to-azure-app-service)
   - 7.3 [Deploy Web Frontend to Azure Static Web Apps](#73-deploy-web-frontend-to-azure-static-web-apps)
   - 7.4 [Build & Distribute Mobile App (Expo EAS)](#74-build--distribute-mobile-app-expo-eas)
8. [Telegram Bot Integration](#8-telegram-bot-integration)
9. [Managed Plugin Deployment Automation](#9-managed-plugin-deployment-automation)
10. [Verification & Health Checks](#10-verification--health-checks)
11. [Troubleshooting](#11-troubleshooting)
12. [Quick-Reference: All Environment Variables](#12-quick-reference-all-environment-variables)
13. [References](#13-references)

---

## 1. Platform Overview

Lumina is an **Open Innovation Ecosystem** for scalable and evolutional educational mobile chatbots, built for Nanyang Technological University (NTU).

### Architecture Components

| Component | Directory | Technology | Purpose |
|---|---|---|---|
| **Web Frontend** | `lumina-web-fe/` | React 18, MUI, MSAL | Developer portal — plugin management, creation, deployment |
| **Web Backend** | `lumina-web-be/` | Node.js, Express 4, Mongoose | REST API for web portal, Telegram bot, deployment automation |
| **Mobile Frontend** | `Lumina-Mobile-FE/` | React Native (Expo 54), Expo Router | Student mobile app — chat with plugins, favourites, history |
| **Mobile Backend** | `Lumina-Mobile-BE/` | Node.js, Express 4, Mongoose | REST API for mobile app, Azure OpenAI proxy |
| **Function App Template** | `lumina-function/` | Azure Functions (Node.js) | Optional timer/utility functions |

### Azure Resources Used

| Azure Service | Purpose |
|---|---|
| Azure Cosmos DB (MongoDB API) | Primary database for all backends |
| Azure OpenAI | GPT-4o-mini base model for mobile chat |
| Azure App Service × 2 | Hosting web backend and mobile backend |
| Azure Static Web Apps | Hosting the React web frontend |
| Azure Storage Account | Artifact storage for managed plugin deployments |
| Azure Function Apps (Consumption) | Hosting managed plugin chatbot backends |
| Azure AD (Entra ID) | Authentication via MSAL for both web and mobile |
| Azure Application Insights | (Optional) Monitoring for deployed function apps |

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           DEVELOPER FLOW                            │
│  Developer → Web Frontend (Static Web App)                          │
│       ↕ MSAL Auth                                                   │
│  Web Frontend → Web Backend (App Service, port 8080)                │
│       ↕ MongoDB (Cosmos DB)                                         │
│  Web Backend → Azure (creates Function Apps for managed plugins)    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           STUDENT FLOW                              │
│  Student → Mobile App (Expo / Expo Go)                              │
│       ↕ MSAL Auth                                                   │
│  Mobile App → Mobile Backend (App Service, port 3002)               │
│       ↕ MongoDB (Cosmos DB)                                         │
│  Mobile Backend → Azure OpenAI  (base GPT model)                   │
│  Mobile Backend → Plugin Function Apps  (custom chatbots)           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        TELEGRAM FLOW (Optional)                     │
│  Telegram User → Telegram API → Web Backend webhook                 │
│  Web Backend → Plugin Function App → response → Telegram User      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Prerequisites & Tooling

### Required Software

| Software | Minimum Version | Install Command / URL |
|---|---|---|
| **Node.js** | 18.x LTS | https://nodejs.org/ |
| **npm** | 9.x | Bundled with Node.js |
| **Git** | Latest | https://git-scm.com/ |
| **Azure CLI** | 2.50+ | https://learn.microsoft.com/cli/azure/install-azure-cli |
| **Expo CLI** | Latest | `npm install -g expo-cli` |
| **Expo Go app** | Latest | Google Play Store / Apple App Store |

### Optional Software

| Software | Purpose |
|---|---|
| **ngrok** | Expose local backend for Telegram webhook testing |
| **MongoDB Compass** | GUI for inspecting Cosmos DB / MongoDB data |
| **VS Code** | Recommended IDE |
| **Nodemon** | Auto-restart during development (installed as devDependency) |

### Required Accounts

- [ ] **Azure Subscription** with Owner or Contributor access
- [ ] **GitHub Account** (for CI/CD workflows)
- [ ] **Telegram Account** (only if setting up Telegram bot integration)
- [ ] **Expo Account** (only for EAS builds: `npx expo register`)

### Verification

```bash
node --version    # Expected: v18.x.x or higher
npm --version     # Expected: 9.x.x or higher
git --version     # Expected: git version 2.x.x
az --version      # Expected: azure-cli 2.50.0 or higher
```

---

## 3. Clone the Repository

```bash
git clone https://github.com/yanxchi/Lumina.git
cd Lumina
```

### Repository Structure

```
Lumina/
├── lumina-web-fe/           # Web Frontend (React)
├── lumina-web-be/           # Web Backend (Express)
├── Lumina-Mobile-FE/        # Mobile Frontend (React Native / Expo)
├── Lumina-Mobile-BE/        # Mobile Backend (Express)
├── lumina-function/         # Azure Function App template
├── MDs/                     # Documentation & update logs
├── .github/workflows/       # CI/CD pipelines
├── staticwebapp.config.json # Azure Static Web App config
└── README.md
```

---

## 4. Azure Infrastructure Setup (From Scratch)

> **⚠️ Important:** All commands below assume you have NO existing Azure resources. Replace all `<placeholder>` values with your own. The guide uses `southeastasia` as the default region — adjust if needed.

### 4.1 Install & Authenticate Azure CLI

```bash
# Install Azure CLI (if not already installed)
# Windows:
winget install -e --id Microsoft.AzureCLI

# macOS:
brew install azure-cli

# Linux (Ubuntu/Debian):
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

```bash
# Log in to Azure
az login

# List available subscriptions
az account list --output table

# Set the active subscription
az account set --subscription "<your-subscription-name-or-id>"

# Verify
az account show --query "{Name:name, SubscriptionId:id, TenantId:tenantId}" --output table
```

**✅ Verification:** The output should show your subscription name and ID.

### 4.2 Create Resource Groups

Lumina uses two resource groups:
- **`lumina-platform-rg`** — Core platform resources (databases, app services, OpenAI)
- **`lumina-deployments-rg`** — Managed plugin deployments (function apps, storage)

```bash
# Core platform resource group
az group create \
  --name lumina-platform-rg \
  --location southeastasia

# Deployment automation resource group
az group create \
  --name lumina-deployments-rg \
  --location southeastasia
```

**✅ Verification:**
```bash
az group list --query "[?starts_with(name,'lumina')].{Name:name, Location:location, State:properties.provisioningState}" --output table
```

Expected output: Both resource groups with `Succeeded` state.

### 4.3 Provision Azure Cosmos DB (MongoDB API)

Both backends share a single Cosmos DB account with MongoDB API.

```bash
# Create Cosmos DB account with MongoDB API
az cosmosdb create \
  --name lumina-cosmos-db \
  --resource-group lumina-platform-rg \
  --kind MongoDB \
  --server-version 4.2 \
  --default-consistency-level Session \
  --locations regionName=southeastasia failoverPriority=0

# Get the connection string (save this — you will need it for .env files)
az cosmosdb keys list \
  --name lumina-cosmos-db \
  --resource-group lumina-platform-rg \
  --type connection-strings \
  --query "connectionStrings[0].connectionString" \
  --output tsv
```

> **📝 Note:** The connection string format for Cosmos DB (MongoDB API) is:
> ```
> mongodb://lumina-cosmos-db:<key>@lumina-cosmos-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@lumina-cosmos-db@
> ```
> Alternatively, you can use **MongoDB Atlas** (free tier available) with a standard connection string:
> ```
> mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
> ```

**✅ Verification:**
```bash
az cosmosdb show --name lumina-cosmos-db --resource-group lumina-platform-rg --query "provisioningState" --output tsv
```
Expected: `Succeeded`

### 4.4 Provision Azure OpenAI

Azure OpenAI provides the base GPT model used by the mobile app.

```bash
# Create Azure OpenAI resource
az cognitiveservices account create \
  --name lumina-openai \
  --resource-group lumina-platform-rg \
  --kind OpenAI \
  --sku S0 \
  --location southeastasia \
  --custom-domain lumina-openai

# Deploy a GPT model (e.g., gpt-4o-mini)
az cognitiveservices account deployment create \
  --name lumina-openai \
  --resource-group lumina-platform-rg \
  --deployment-name gpt-4o-mini \
  --model-name gpt-4o-mini \
  --model-version "2024-07-18" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard

# Get the API key
az cognitiveservices account keys list \
  --name lumina-openai \
  --resource-group lumina-platform-rg \
  --query "key1" --output tsv

# Get the endpoint
az cognitiveservices account show \
  --name lumina-openai \
  --resource-group lumina-platform-rg \
  --query "properties.endpoint" --output tsv
```

The **API Base URL** for the mobile backend `.env` follows this format:
```
https://<your-openai-resource>.openai.azure.com/openai/deployments/<deployment-name>/chat/completions
```

Example:
```
https://lumina-openai.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions
```

**✅ Verification:**
```bash
az cognitiveservices account show --name lumina-openai --resource-group lumina-platform-rg --query "provisioningState" --output tsv
```
Expected: `Succeeded`

### 4.5 Create Azure App Service for Web Backend

```bash
# Create App Service Plan (Linux, B1 tier)
az appservice plan create \
  --name lumina-web-plan \
  --resource-group lumina-platform-rg \
  --is-linux \
  --sku B1

# Create the Web App
az webapp create \
  --name lumina-web-be \
  --resource-group lumina-platform-rg \
  --plan lumina-web-plan \
  --runtime "NODE:18-lts"
```

> **📝 Note:** The app name must be globally unique. If `lumina-web-be` is taken, choose a different name (e.g., `lumina-web-be-<yourname>`). The URL will be `https://<app-name>.azurewebsites.net`.

**✅ Verification:**
```bash
az webapp show --name lumina-web-be --resource-group lumina-platform-rg --query "state" --output tsv
```
Expected: `Running`

### 4.6 Create Azure App Service for Mobile Backend

```bash
# Create App Service Plan (can reuse the same plan or create a new one)
az appservice plan create \
  --name lumina-mobile-plan \
  --resource-group lumina-platform-rg \
  --is-linux \
  --sku B1

# Create the Web App
az webapp create \
  --name lumina-mobile-be \
  --resource-group lumina-platform-rg \
  --plan lumina-mobile-plan \
  --runtime "NODE:18-lts"
```

**✅ Verification:**
```bash
az webapp show --name lumina-mobile-be --resource-group lumina-platform-rg --query "defaultHostName" --output tsv
```
Expected: `lumina-mobile-be.azurewebsites.net` (or similar)

### 4.7 Create Azure Static Web App for Web Frontend

```bash
# Create Static Web App (Free tier)
az staticwebapp create \
  --name lumina-web-fe \
  --resource-group lumina-platform-rg \
  --source https://github.com/<your-github-username>/Lumina \
  --branch main \
  --app-location "./lumina-web-fe" \
  --output-location "build" \
  --login-with-github
```

> **📝 Note:** This will prompt you to authenticate with GitHub and set up a CI/CD workflow automatically. The generated workflow file will be similar to `.github/workflows/azure-static-web-apps-ashy-moss-01833a500.yml` in the repo.

Alternatively, create the Static Web App from the **Azure Portal** and configure the GitHub Actions workflow manually.

**✅ Verification:**
```bash
az staticwebapp show --name lumina-web-fe --resource-group lumina-platform-rg --query "defaultHostname" --output tsv
```
Expected: A hostname like `<random-name>.azurestaticapps.net`

### 4.8 Create Azure Storage Account (Deployment Artifacts)

This storage account is used by the deployment automation to store artifacts for managed plugin Function Apps.

```bash
az storage account create \
  --name luminadeploystorage \
  --resource-group lumina-deployments-rg \
  --location southeastasia \
  --sku Standard_LRS \
  --kind StorageV2
```

> **📝 Note:** Storage account names must be globally unique, lowercase, and 3–24 characters. Adjust `luminadeploystorage` if needed.

**✅ Verification:**
```bash
az storage account show --name luminadeploystorage --resource-group lumina-deployments-rg --query "provisioningState" --output tsv
```
Expected: `Succeeded`

### 4.9 Create Service Principal for Deployment Automation

The web backend uses a Service Principal to programmatically create and manage Azure Function Apps for managed plugin deployments.

```bash
# Get your subscription ID
SUBSCRIPTION_ID=$(az account show --query "id" --output tsv)

# Create Service Principal with Contributor access to the deployments resource group
az ad sp create-for-rbac \
  --name "lumina-deployment-sp" \
  --role Contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/lumina-deployments-rg \
  --sdk-auth
```

**⚠️ Save the entire JSON output!** You will need these values:

```json
{
  "clientId": "<your-client-id>",
  "clientSecret": "<your-client-secret>",
  "subscriptionId": "<your-subscription-id>",
  "tenantId": "<your-tenant-id>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  ...
}
```

These values map to environment variables:

| JSON Key | Environment Variable |
|---|---|
| `clientId` | `AZURE_CLIENT_ID` |
| `clientSecret` | `AZURE_CLIENT_SECRET` |
| `subscriptionId` | `AZURE_SUBSCRIPTION_ID` |
| `tenantId` | `AZURE_TENANT_ID` |

### 4.10 Register Azure AD App Registrations (Authentication)

Lumina uses **Microsoft Authentication Library (MSAL)** for both web and mobile. You need **two** app registrations — one for the web portal and one for the mobile app.

#### 4.10.1 Web Portal App Registration

1. Go to **Azure Portal** → **Microsoft Entra ID** → **App registrations** → **New registration**
2. Configure:
   - **Name:** `Lumina Web Portal`
   - **Supported account types:** `Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)`
   - **Redirect URI:**
     - Type: `Single-page application (SPA)`
     - URI: `https://<your-static-web-app>.azurestaticapps.net` (production)
     - Add another URI: `http://localhost:3000` (development)
3. After creation, note down:
   - **Application (client) ID** → used in `lumina-web-fe/src/config.js`
   - **Directory (tenant) ID** → used in `lumina-web-fe/src/config.js`
4. Go to **API permissions** → ensure `User.Read`, `openid`, `email`, `profile` are added

#### 4.10.2 Mobile App Registration

1. Go to **Azure Portal** → **Microsoft Entra ID** → **App registrations** → **New registration**
2. Configure:
   - **Name:** `Lumina Mobile`
   - **Supported account types:** `Accounts in any organizational directory`
   - **Redirect URI:**
     - Type: `Mobile and desktop applications`
     - URI: `com.lumina://auth` (matches the scheme in `app.json`)
3. After creation, note down:
   - **Application (client) ID** → used in `Lumina-Mobile-FE/config/authConfig.js`
   - **Directory (tenant) ID** → used in `Lumina-Mobile-FE/config/authConfig.js`
4. Go to **API permissions** → ensure `User.Read`, `openid`, `email`, `profile` are added

**✅ Verification:** Test both app registrations by attempting to sign in from the respective frontends after configuration (see Section 5).

---


## 5. Component Configuration & Environment Variables

### 5.1 Lumina Web Backend (`lumina-web-be`)

**Config file path:** `lumina-web-be/.env`
**Template file:** `lumina-web-be/.env.example`

Create the `.env` file:

```bash
cd lumina-web-be
cp .env.example .env
```

Complete `.env` template with descriptions:

```env
# ===========================================
# MongoDB Connection String (REQUIRED)
# ===========================================
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
# Or Cosmos DB: mongodb://...:10255/?ssl=true&replicaSet=globaldb&...
MONGODB_URI=<your-cosmos-db-or-mongodb-connection-string>

# ===========================================
# Server Configuration
# ===========================================
# Server Port — Azure will override this with its own PORT value
# Default: 8080
PORT=8080

# Frontend Origin for CORS
# Local: http://localhost:3000
# Production: https://<your-static-web-app>.azurestaticapps.net
FRONTEND_ORIGIN=http://localhost:3000

# Node Environment
# Options: development, production
NODE_ENV=development

# ===========================================
# Telegram Bot Configuration (OPTIONAL)
# ===========================================
# Obtain from @BotFather on Telegram: https://t.me/botfather
# Format: 123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>

# Telegram API URL (usually no need to change)
TELEGRAM_API_URL=https://api.telegram.org/bot

# ===========================================
# Azure Deployment Automation (REQUIRED for managed deployments)
# ===========================================
# Service Principal credentials (from Section 4.9)
AZURE_TENANT_ID=<your-tenant-id>
AZURE_CLIENT_ID=<your-client-id>
AZURE_CLIENT_SECRET=<your-client-secret>
AZURE_SUBSCRIPTION_ID=<your-subscription-id>

# Azure Resources (from Sections 4.2 and 4.8)
AZURE_RESOURCE_GROUP=lumina-deployments-rg
AZURE_STORAGE_ACCOUNT=luminadeploystorage
AZURE_LOCATION=southeastasia

# Application Insights Key (OPTIONAL — for monitoring deployed function apps)
AZURE_APP_INSIGHTS_KEY=<your-app-insights-instrumentation-key>
```

| Variable | Required | Used For |
|---|---|---|
| `MONGODB_URI` | ✅ Yes | Database connection |
| `PORT` | ❌ Optional (default: 8080) | Server port |
| `FRONTEND_ORIGIN` | ❌ Optional (default: `*`) | CORS policy |
| `NODE_ENV` | ❌ Optional | Environment mode |
| `TELEGRAM_BOT_TOKEN` | ⚠️ If using Telegram | Telegram bot API |
| `TELEGRAM_API_URL` | ❌ Optional | Telegram API base URL |
| `AZURE_TENANT_ID` | ⚠️ If using managed deployments | Service Principal auth |
| `AZURE_CLIENT_ID` | ⚠️ If using managed deployments | Service Principal auth |
| `AZURE_CLIENT_SECRET` | ⚠️ If using managed deployments | Service Principal auth |
| `AZURE_SUBSCRIPTION_ID` | ⚠️ If using managed deployments | Azure subscription |
| `AZURE_RESOURCE_GROUP` | ⚠️ If using managed deployments | Target resource group |
| `AZURE_STORAGE_ACCOUNT` | ⚠️ If using managed deployments | Storage for Function Apps |
| `AZURE_LOCATION` | ❌ Optional (default: `southeastasia`) | Azure region |
| `AZURE_APP_INSIGHTS_KEY` | ❌ Optional | Monitoring |

**Additional config file:** `lumina-web-fe/src/config/axiosConfig.js` — The web frontend's axios config points to the web backend base URL. This is configured in `lumina-web-fe/src/config.js` (see Section 5.3).

**✅ Verification:**
```bash
cd lumina-web-be
node -e "require('dotenv').config(); console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'MISSING'); console.log('AZURE_TENANT_ID:', process.env.AZURE_TENANT_ID ? 'SET' : 'MISSING');"
```

### 5.2 Lumina Mobile Backend (`Lumina-Mobile-BE`)

**Config file path:** `Lumina-Mobile-BE/.env`
**No `.env.example` exists** — create the file manually.

```bash
cd Lumina-Mobile-BE
```

Create `.env` with the following content:

```env
# ===========================================
# Azure OpenAI Configuration (REQUIRED)
# ===========================================
# Full URL including deployment name
# Format: https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions
AZURE_OPENAI_API_BASE=<your-azure-openai-endpoint>

# Azure OpenAI API Key
AZURE_OPENAI_APIKEY=<your-azure-openai-api-key>

# API Version
AZURE_OPENAI_APIVERSION=2025-01-01-preview

# ===========================================
# MongoDB Connection String (REQUIRED)
# ===========================================
# Same Cosmos DB / MongoDB connection string as the web backend
MONGODB_URI=<your-cosmos-db-or-mongodb-connection-string>

# ===========================================
# Server Configuration
# ===========================================
# Default: 3002 (Azure will override with its own PORT)
PORT=3002
```

| Variable | Required | Used For |
|---|---|---|
| `AZURE_OPENAI_API_BASE` | ✅ Yes | Azure OpenAI chat completions endpoint |
| `AZURE_OPENAI_APIKEY` | ✅ Yes | Azure OpenAI authentication |
| `AZURE_OPENAI_APIVERSION` | ✅ Yes | Azure OpenAI API version |
| `MONGODB_URI` | ✅ Yes | Database connection |
| `PORT` | ❌ Optional (default: 3002) | Server port |

**✅ Verification:**
```bash
cd Lumina-Mobile-BE
node -e "require('dotenv').config(); ['AZURE_OPENAI_API_BASE','AZURE_OPENAI_APIKEY','MONGODB_URI'].forEach(k => console.log(k+':', process.env[k] ? 'SET' : 'MISSING'));"
```


### 5.3 Lumina Web Frontend (`lumina-web-fe`)

**Config file path:** `lumina-web-fe/src/config.js`

This file contains **both** MSAL authentication settings and the backend API URL. Edit the following values:

```javascript
// lumina-web-fe/src/config.js

// ⚠️ CONFIGURATION - UPDATE THESE VALUES
// ===========================================

// Azure AD App Registration Settings
export const authConfig = {
 // Get this from Azure Portal → App registrations → Application (client) ID
 clientId: "<your-web-portal-client-id>",       // From Section 4.10.1

 // Get this from Azure Portal → App registrations → Directory (tenant) ID
 tenantId: "<your-tenant-id>",                   // From Section 4.10.1

 // Authority URL — use "common" for multi-tenant
 authority: "https://login.microsoftonline.com/common",

 // Redirect URIs
 // Production: Your deployed Azure Static Web App URL
 redirectUri: "https://<your-static-web-app>.azurestaticapps.net",
 // Local development: Uncomment when testing locally
 // redirectUri: "http://localhost:3000",

 // Scopes (permissions app needs)
 scopes: ["User.Read", "openid", "email", "profile"],
};

// Backend API Configuration
export const apiConfig = {
 // Production backend URL (from Section 4.5)
 baseURL: "https://<your-web-be-app-name>.azurewebsites.net",
 // Local development backend (uncomment when running backend locally)
 // baseURL: "http://localhost:8080",
};
```

| Config Value | Where to Get It |
|---|---|
| `clientId` | Azure Portal → App registrations → `Lumina Web Portal` → Application (client) ID |
| `tenantId` | Azure Portal → App registrations → `Lumina Web Portal` → Directory (tenant) ID |
| `redirectUri` | Your Azure Static Web App URL (from Section 4.7) |
| `apiConfig.baseURL` | Your Web Backend App Service URL (from Section 4.5) |

> **📝 Note:** The `axiosConfig.js` file at `lumina-web-fe/src/config/axiosConfig.js` automatically reads `apiConfig.baseURL` from `config.js`. No separate configuration is needed.

> **⚠️ For local development:** Uncomment the `redirectUri: "http://localhost:3000"` line and comment out the production one. Similarly, uncomment the local `baseURL` in `apiConfig`.

**✅ Verification:** Start the frontend locally and check the browser console for MSAL initialization errors:
```bash
cd lumina-web-fe
npm start
# Open browser → DevTools → Console — should not show MSAL errors
```

### 5.4 Lumina Mobile Frontend (`Lumina-Mobile-FE`)

**Config file path:** `Lumina-Mobile-FE/config/authConfig.js`

```javascript
// Lumina-Mobile-FE/config/authConfig.js

export const authConfig = {
 // Azure AD Configuration
 clientId: "<your-mobile-app-client-id>",    // From Section 4.10.2
 tenantId: "<your-tenant-id>",               // From Section 4.10.2

 // Authority URL — use "common" for multi-tenant
 authority: "https://login.microsoftonline.com/common/v2.0",

 // Scopes — permissions your app needs
 scopes: ["openid", "profile", "email", "User.Read"],

 // Redirect URI scheme (must match app.json "scheme" field)
 redirectScheme: "com.lumina",
};

// Backend API Configuration
export const apiConfig = {
 // Production backend URL (from Section 4.6)
 baseURL: "https://<your-mobile-be-app-name>.azurewebsites.net",
};
```

| Config Value | Where to Get It |
|---|---|
| `clientId` | Azure Portal → App registrations → `Lumina Mobile` → Application (client) ID |
| `tenantId` | Azure Portal → App registrations → `Lumina Mobile` → Directory (tenant) ID |
| `apiConfig.baseURL` | Your Mobile Backend App Service URL (from Section 4.6) |

> **📝 Note:** The `redirectScheme` must match the `scheme` field in `Lumina-Mobile-FE/app.json` (`"com.lumina"`). The actual redirect URI used at runtime is `msal<clientId>://auth` — this is constructed automatically by the Expo auth library.

> **⚠️ Azure AD Redirect URI:** In your Mobile App Registration (Section 4.10.2), ensure the redirect URI is set to `msal<your-client-id>://auth` (e.g., `msal71519bba-3a1e-4a1c-9924-49754f9e992c://auth`).

**Additional config:** `Lumina-Mobile-FE/config/axiosConfig.js` — reads `apiConfig.baseURL` from `authConfig.js` automatically.

**✅ Verification:** The mobile app should be able to sign in via Microsoft and reach the home screen.

---


## 6. Local Development Setup

### 6.1 Install Dependencies (All Components)

Run the following from the repository root:

```bash
# Web Backend
cd lumina-web-be
npm install
cd ..

# Mobile Backend
cd Lumina-Mobile-BE
npm install
cd ..

# Web Frontend
cd lumina-web-fe
npm install
cd ..

# Mobile Frontend
cd Lumina-Mobile-FE
npm install
cd ..
```

### 6.2 Start the Web Backend

```bash
cd lumina-web-be
npm run dev
# Or without nodemon:
# node index.js
```

Expected output:
```
Server running on port 8080
DB connected
Telegram webhook registration skipped: TELEGRAM_BOT_TOKEN not set
```

> **📝 Note:** The web backend runs on port **8080** by default.

### 6.3 Start the Mobile Backend

```bash
cd Lumina-Mobile-BE
npm run dev
# Or:
# node index.js
```

Expected output:
```
Server is running on port 3002
DB connected
```

> **📝 Note:** The mobile backend runs on port **3002** by default.

### 6.4 Start the Web Frontend

Before starting, ensure `lumina-web-fe/src/config.js` is set for local development:
- `redirectUri` → `"http://localhost:3000"`
- `apiConfig.baseURL` → `"http://localhost:8080"`

```bash
cd lumina-web-fe
npm start
```

The React development server will open at `http://localhost:3000`.

### 6.5 Start the Mobile Frontend

Before starting, ensure `Lumina-Mobile-FE/config/authConfig.js` has the correct `apiConfig.baseURL`:
- For local testing on same machine: `"http://localhost:3002"`
- For testing on physical device: `"http://<your-local-ip>:3002"`

```bash
cd Lumina-Mobile-FE
npx expo start
```

Options:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Scan the QR code with **Expo Go** app on your physical device

> **⚠️ Physical Device Note:** When testing on a physical device via Expo Go, use your computer's local IP address (e.g., `http://192.168.x.x:3002`) instead of `localhost` for the backend URL.

### 6.6 Local Development Checklist

| Component | URL | Status Check |
|---|---|---|
| Web Backend | `http://localhost:8080` | `curl http://localhost:8080` → response |
| Mobile Backend | `http://localhost:3002` | `curl http://localhost:3002` → response |
| Web Frontend | `http://localhost:3000` | Browser → Login page renders |
| Mobile Frontend | Expo Dev Server | Expo Go → App loads on device |

---


## 7. Production Deployment

### 7.1 Deploy Web Backend to Azure App Service

#### Option A: GitHub Actions (Recommended — CI/CD)

The repository includes a GitHub Actions workflow at `.github/workflows/main_lumina-web-be.yml` that automates deployment on every push to `main`.

**Setup steps:**

1. **Create a Service Principal for GitHub Actions:**
   ```bash
   az ad sp create-for-rbac \
     --name "github-lumina-web-be" \
     --role Contributor \
     --scopes /subscriptions/<subscription-id>/resourceGroups/lumina-platform-rg \
     --sdk-auth
   ```

2. **Configure GitHub Secrets** in your repository → Settings → Secrets and variables → Actions:
   - `AZUREAPPSERVICE_CLIENTID_...` → Service Principal `clientId`
   - `AZUREAPPSERVICE_TENANTID_...` → Service Principal `tenantId`
   - `AZUREAPPSERVICE_SUBSCRIPTIONID_...` → Your subscription ID

3. **Configure Azure App Service environment variables:**
   ```bash
   az webapp config appsettings set \
     --name lumina-web-be \
     --resource-group lumina-platform-rg \
     --settings \
       MONGODB_URI="<your-connection-string>" \
       FRONTEND_ORIGIN="https://<your-static-web-app>.azurestaticapps.net" \
       NODE_ENV="production" \
       TELEGRAM_BOT_TOKEN="<your-bot-token>" \
       TELEGRAM_API_URL="https://api.telegram.org/bot" \
       AZURE_TENANT_ID="<your-tenant-id>" \
       AZURE_CLIENT_ID="<your-client-id>" \
       AZURE_CLIENT_SECRET="<your-client-secret>" \
       AZURE_SUBSCRIPTION_ID="<your-subscription-id>" \
       AZURE_RESOURCE_GROUP="lumina-deployments-rg" \
       AZURE_STORAGE_ACCOUNT="luminadeploystorage" \
       AZURE_LOCATION="southeastasia"
   ```

4. Push to `main` → GitHub Actions will build and deploy automatically.

#### Option B: Manual Zip Deploy

```bash
cd lumina-web-be
zip -r deploy.zip . -x "node_modules/*" -x ".git/*" -x ".env"
az webapp deploy \
  --resource-group lumina-platform-rg \
  --name lumina-web-be \
  --src-path deploy.zip \
  --type zip
```

**✅ Verification:**
```bash
curl https://<your-web-be-app-name>.azurewebsites.net
```

### 7.2 Deploy Mobile Backend to Azure App Service

The workflow at `.github/workflows/main_lumina-mobile-be.yml` deploys on push to `main`.

**Setup steps:**

1. **Create a Service Principal** (same process as 7.1 Option A, step 1).

2. **Configure GitHub Secrets** with the mobile backend's Service Principal credentials.

3. **Configure Azure App Service environment variables:**
   ```bash
   az webapp config appsettings set \
     --name lumina-mobile-be \
     --resource-group lumina-platform-rg \
     --settings \
       MONGODB_URI="<your-connection-string>" \
       AZURE_OPENAI_API_BASE="https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions" \
       AZURE_OPENAI_APIKEY="<your-openai-key>" \
       AZURE_OPENAI_APIVERSION="2025-01-01-preview"
   ```

4. Push to `main` → GitHub Actions will build and deploy automatically.

**✅ Verification:**
```bash
curl https://<your-mobile-be-app-name>.azurewebsites.net
```

### 7.3 Deploy Web Frontend to Azure Static Web Apps

The workflow at `.github/workflows/azure-static-web-apps-ashy-moss-01833a500.yml` deploys on push to `main`.

**Key workflow settings:**
- `app_location`: `"./lumina-web-fe"` — source code path
- `output_location`: `"build"` — built app directory
- `app_build_command`: `"CI=false npm run build"` — disables ESLint warnings as errors

**Setup steps:**

1. When you created the Static Web App (Section 4.7), a GitHub Actions workflow was auto-generated.
2. **Update `lumina-web-fe/src/config.js`** with production values before pushing:
   - Set `redirectUri` to your Static Web App URL
   - Set `apiConfig.baseURL` to your Web Backend URL
3. Push to `main` → the Static Web App will build and deploy automatically.

> **📝 Note:** The GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN_...` is automatically configured when you link the Static Web App to your GitHub repo.

**✅ Verification:** Visit `https://<your-static-web-app>.azurestaticapps.net` → Login page should render.

### 7.4 Build & Distribute Mobile App (Expo EAS)

The mobile app uses **Expo Application Services (EAS)** for building native binaries.

**Prerequisites:**
- Expo account: `npx expo register` (or `npx expo login`)
- EAS CLI: `npm install -g eas-cli`

```bash
cd Lumina-Mobile-FE

# Log in to Expo
npx expo login

# Configure EAS (first time only)
eas build:configure

# Build for Android (APK for internal distribution)
eas build --platform android --profile preview

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile preview

# Build for production
eas build --platform android --profile production
```

**Build profiles** (from `eas.json`):

| Profile | Use Case | Distribution |
|---|---|---|
| `development` | Development client with hot reload | Internal |
| `preview` | Testing builds (APK/IPA) | Internal |
| `production` | Store-ready builds | Store |

> **📝 Note:** For development testing without native builds, use **Expo Go** (`npx expo start`).

**✅ Verification:** After build completes, download the APK/IPA from the Expo dashboard and install on a test device.

---


## 8. Telegram Bot Integration

> **📝 Reference:** See `MDs/updates/2026-09-01_tele_setup_guide.md` for the full Telegram integration guide.

### 8.1 Create the Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts:
   - **Bot name:** `Lumina Chatbot` (or your preferred name)
   - **Bot username:** Must end in `bot` (e.g., `lumina_ntu_bot`)
4. BotFather will provide a **Bot Token** — save this securely
5. (Optional) Send `/setdescription` to add a description

### 8.2 Configure the Backend

Add the bot token to the Web Backend environment:

```bash
# Local (.env file)
TELEGRAM_BOT_TOKEN=<your-bot-token-from-botfather>

# Azure App Service
az webapp config appsettings set \
  --name lumina-web-be \
  --resource-group lumina-platform-rg \
  --settings TELEGRAM_BOT_TOKEN="<your-bot-token>"
```

### 8.3 Register the Webhook

The webhook is **auto-registered** on server startup (see `lumina-web-be/services/telegramService.js`). However, the webhook URL is currently hardcoded. For your own deployment:

1. **Update the webhook URL** in `lumina-web-be/services/telegramService.js`:
   ```javascript
   const webhookUrl = "https://<your-web-be-app-name>.azurewebsites.net/api/telegram/webhook";
   ```

2. **Or register manually via curl:**
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://<your-web-be-app-name>.azurewebsites.net/api/telegram/webhook"}'
   ```

   Expected response:
   ```json
   {"ok": true, "result": true, "description": "Webhook was set"}
   ```

### 8.4 Verify Webhook Status

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

Expected: `"url"` should match your backend's webhook endpoint, and `"last_error_date"` should be absent or old.

### 8.5 Test the Bot

1. Open Telegram → search for your bot username
2. Send `/start` → should receive a welcome message
3. Send `/list` → should show available chatbot plugins
4. Select a plugin → send a message → should receive a chatbot response

> **⚠️ Telegram requires HTTPS.** For local development, use **ngrok** to create a tunnel:
> ```bash
> ngrok http 8080
> # Then register the ngrok URL as the webhook:
> curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
>   -d '{"url": "https://<ngrok-subdomain>.ngrok.io/api/telegram/webhook"}'
> ```

---

## 9. Managed Plugin Deployment Automation

> **📝 Reference:** See `MDs/updates/2026-05-01_setup_instructions.md` for the full deployment automation guide.

### How It Works

When a developer creates a **managed** plugin via the Web Portal:

1. Developer uploads a **zip file** containing the plugin code (Azure Function App)
2. Web Frontend calls `POST /api/deploy/validate` to validate the zip structure
3. Developer proceeds through the creation wizard and submits
4. Web Frontend calls `POST /api/deploy/:pluginId` with the zip file
5. Web Backend:
   - Creates an Azure Function App (Consumption Plan) in `lumina-deployments-rg`
   - Deploys the zip code via Kudu API (zip deploy)
   - Updates the plugin record with the generated Function App URL
   - Optionally registers the plugin with Telegram if `telegramSupport` is enabled
6. Plugin is auto-activated and available in the Mobile App

### Required Environment Variables

All deployment automation variables must be set in the Web Backend (see Section 5.1):

| Variable | Purpose |
|---|---|
| `AZURE_TENANT_ID` | Service Principal authentication |
| `AZURE_CLIENT_ID` | Service Principal authentication |
| `AZURE_CLIENT_SECRET` | Service Principal authentication |
| `AZURE_SUBSCRIPTION_ID` | Target Azure subscription |
| `AZURE_RESOURCE_GROUP` | Resource group for deployed Function Apps |
| `AZURE_STORAGE_ACCOUNT` | Storage for Function App artifacts |
| `AZURE_LOCATION` | Azure region for new resources |

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/deploy/validate` | Validate zip file structure |
| `POST` | `/api/deploy/:pluginId` | Deploy plugin to Azure Functions |
| `GET` | `/api/deploy/:pluginId/status` | Get deployment status |
| `DELETE` | `/api/deploy/:pluginId` | Delete deployed Function App |

### Expected Zip Structure

```
plugin.zip/
├── src/
│   ├── functions/
│   │   └── http_trigger.js    # Main HTTP trigger function
│   └── index.js               # Function app entry point
├── host.json                  # Azure Functions host configuration
├── package.json               # Node.js dependencies
└── package-lock.json
```

**✅ Verification:** Deploy a test plugin from the Web Portal and check:
```bash
# Check the function app was created
az functionapp list --resource-group lumina-deployments-rg --output table

# Check the function app is running
curl https://<function-app-name>.azurewebsites.net/api/http_trigger
```

---

## 10. Verification & Health Checks

### Full System Verification Checklist

| Step | Command / Action | Expected Result |
|---|---|---|
| 1. Azure Resources | `az group list --query "[?starts_with(name,'lumina')]"` | Both resource groups exist |
| 2. Cosmos DB | `az cosmosdb show --name lumina-cosmos-db --resource-group lumina-platform-rg` | `provisioningState: Succeeded` |
| 3. Web Backend | `curl https://<web-be>.azurewebsites.net` | HTTP response |
| 4. Mobile Backend | `curl https://<mobile-be>.azurewebsites.net` | HTTP response |
| 5. Web Frontend | Visit `https://<static-web-app>.azurestaticapps.net` | Login page renders |
| 6. Web Login | Sign in with NTU Microsoft account | Redirects to plugin dashboard |
| 7. Mobile Login | Sign in via Expo Go app | Redirects to home screen |
| 8. Telegram Bot | Send `/start` to bot | Welcome message received |
| 9. Telegram Health | `curl https://<web-be>.azurewebsites.net/api/telegram/health` | Health check response |
| 10. Plugin Deploy | Create and deploy a managed plugin | Function App created, plugin active |

---


## 11. Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|---|---|---|
| `MONGODB_URI not set` on startup | Missing `.env` file or variable | Ensure `.env` exists and `MONGODB_URI` is set |
| CORS errors in browser console | `FRONTEND_ORIGIN` mismatch | Set `FRONTEND_ORIGIN` to exact frontend URL (no trailing slash) |
| MSAL `redirect_uri_mismatch` | Redirect URI not registered in Azure AD | Add the exact URI (including port) to App Registration → Authentication → Redirect URIs |
| `401 Unauthorized` on Azure OpenAI | Invalid API key or endpoint | Verify `AZURE_OPENAI_APIKEY` and `AZURE_OPENAI_API_BASE` values |
| Telegram webhook not receiving | Wrong webhook URL or bot token | Run `getWebhookInfo` to check; re-register if needed |
| Deployment fails: `Contributor access required` | Service Principal lacks permissions | Ensure SP has Contributor role on `lumina-deployments-rg` |
| Static Web App shows blank page | Build failed or wrong `output_location` | Check GitHub Actions logs; ensure `output_location: "build"` |
| Expo build fails | Missing EAS configuration | Run `eas build:configure` first |
| `Network Error` on mobile device | Backend not reachable from device | Use local IP instead of `localhost`; ensure same Wi-Fi network |
| Azure Function App times out | Cold start on Consumption Plan | First request may take 10-30 seconds; wait and retry |

### Viewing Azure App Service Logs

```bash
# Stream live logs
az webapp log tail --name lumina-web-be --resource-group lumina-platform-rg

# Enable application logging
az webapp log config \
  --name lumina-web-be \
  --resource-group lumina-platform-rg \
  --application-logging filesystem \
  --level information
```

### Checking GitHub Actions Deployment Status

1. Go to your GitHub repository → **Actions** tab
2. Select the relevant workflow
3. Click on the latest run to see build and deploy logs

---

## 12. Quick-Reference: All Environment Variables

### Web Backend (`lumina-web-be/.env`)

```env
MONGODB_URI=<cosmos-db-or-mongodb-connection-string>
PORT=8080
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=<telegram-bot-token>
TELEGRAM_API_URL=https://api.telegram.org/bot
AZURE_TENANT_ID=<service-principal-tenant-id>
AZURE_CLIENT_ID=<service-principal-client-id>
AZURE_CLIENT_SECRET=<service-principal-client-secret>
AZURE_SUBSCRIPTION_ID=<azure-subscription-id>
AZURE_RESOURCE_GROUP=lumina-deployments-rg
AZURE_STORAGE_ACCOUNT=luminadeploystorage
AZURE_LOCATION=southeastasia
AZURE_APP_INSIGHTS_KEY=<optional-app-insights-key>
```

### Mobile Backend (`Lumina-Mobile-BE/.env`)

```env
AZURE_OPENAI_API_BASE=https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions
AZURE_OPENAI_APIKEY=<azure-openai-api-key>
AZURE_OPENAI_APIVERSION=2025-01-01-preview
MONGODB_URI=<cosmos-db-or-mongodb-connection-string>
PORT=3002
```

### Web Frontend (`lumina-web-fe/src/config.js`)

| Setting | Value |
|---|---|
| `authConfig.clientId` | Azure AD App Registration Client ID (Web) |
| `authConfig.tenantId` | Azure AD Directory (Tenant) ID |
| `authConfig.redirectUri` | Static Web App URL or `http://localhost:3000` |
| `apiConfig.baseURL` | Web Backend URL or `http://localhost:8080` |

### Mobile Frontend (`Lumina-Mobile-FE/config/authConfig.js`)

| Setting | Value |
|---|---|
| `authConfig.clientId` | Azure AD App Registration Client ID (Mobile) |
| `authConfig.tenantId` | Azure AD Directory (Tenant) ID |
| `apiConfig.baseURL` | Mobile Backend URL or `http://localhost:3002` |

---

## 13. References

| Resource | URL |
|---|---|
| Azure CLI Documentation | https://learn.microsoft.com/cli/azure/ |
| Azure Cosmos DB (MongoDB API) | https://learn.microsoft.com/azure/cosmos-db/mongodb/ |
| Azure OpenAI Service | https://learn.microsoft.com/azure/ai-services/openai/ |
| Azure App Service | https://learn.microsoft.com/azure/app-service/ |
| Azure Static Web Apps | https://learn.microsoft.com/azure/static-web-apps/ |
| Azure Functions | https://learn.microsoft.com/azure/azure-functions/ |
| MSAL.js (Browser) | https://learn.microsoft.com/entra/identity-platform/msal-js-initializing-client-applications |
| Expo Documentation | https://docs.expo.dev/ |
| EAS Build | https://docs.expo.dev/build/introduction/ |
| Telegram Bot API | https://core.telegram.org/bots/api |
| BotFather | https://t.me/botfather |

### Internal Documentation

| Document | Path |
|---|---|
| Deployment Automation Guide | `MDs/updates/2026-05-01_setup_instructions.md` |
| Telegram Setup Guide | `MDs/updates/2026-09-01_tele_setup_guide.md` |
| Telegram Integration Overview | `MDs/updates/2026-10-01_tele_overall.md` |
| Telegram Chat Implementation | `MDs/updates/2026-07-01_tele_chat.md` |
| Deployment Automation Design | `MDs/updates/2026-04-01_deployment_automation.md` |
| Integration SRS | `MDs/updates/2026-02-01_integration_srs.md` |

---

*End of Lumina Platform End-to-End Setup Guide*
