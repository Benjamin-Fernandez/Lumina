# Lumina Platform Technical Report


## A Comprehensive Assessment of the Application Architecture and Capabilities


---


**Document Type:** Final Year Project Technical Report
**Project Title:** Lumina – An Open Innovation Ecosystem for Scalable and Evolutional Educational Mobile Chatbot
**Report Date:** December 2025
**Development Period:** September 2024 – December 2025


---


## Executive Summary


This technical report provides a comprehensive assessment of the Lumina platform, a plugin-based chatbot hosting ecosystem designed for Nanyang Technological University (NTU). The platform enables third-party developers to deploy custom AI chatbots accessible to students through a unified mobile application.


The Lumina platform comprises a dual-interface architecture:


- **Mobile Application:** A React Native application serving as the primary interface for students to discover and interact with AI chatbots
- **Developer Portal:** A React-based web application enabling developers to create, configure, test, and manage chatbot plugins


**Core Platform Capabilities:**


1. **Plugin-Based Architecture:** Third-party developers can deploy custom chatbots that integrate seamlessly with the mobile app
2. **Azure OpenAI Integration:** Built-in GPT-4o-mini integration provides base conversational AI capabilities
3. **Enterprise Authentication:** Azure AD (Microsoft Entra ID) provides secure, institution-wide authentication
4. **Flexible API Integration:** Dynamic endpoint configuration supports diverse external API structures and authentication methods
5. **Automated Synchronization:** Azure Functions enable real-time data propagation between developer portal and mobile app


This report evaluates the platform's final architecture, examines key technical features and their implementations, documents resolved technical challenges, and assesses the current system state with recommendations for future development.


---


## Table of Contents


1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Core Features and Implementation](#4-core-features-and-implementation)
5. [Plugin System Architecture](#5-plugin-system-architecture)
6. [Technical Challenges and Resolutions](#6-technical-challenges-and-resolutions)
7. [Current State Assessment](#7-current-state-assessment)
8. [Future Recommendations](#8-future-recommendations)
9. [Conclusion](#9-conclusion)


---


## 1. Introduction


### 1.1 Project Overview


Lumina is an educational chatbot platform designed to serve the NTU academic community. The platform follows a plugin-based architecture inspired by VSCode's extensibility model, allowing third-party developers to create and deploy custom AI chatbots that students can access through a centralized mobile application.


The platform addresses the challenge of fragmented AI tools in educational settings by providing:


- **For Students:** A single mobile interface to access multiple specialized AI chatbots for academic support, career guidance, and campus information
- **For Developers:** A streamlined portal for deploying, managing, and monitoring custom chatbot plugins without infrastructure overhead
- **For the Institution:** A scalable, controllable ecosystem for educational AI tools that can evolve with emerging technologies


### 1.2 Project Objectives


The primary technical objectives of the Lumina project are:


1. **Unified Access:** Aggregate diverse AI chatbot services into a single, user-friendly mobile interface
2. **Developer Empowerment:** Provide tools for easy plugin creation and deployment without requiring mobile app development expertise
3. **Secure Authentication:** Implement enterprise-grade authentication using institutional identity providers
4. **Flexible Integration:** Support diverse external API structures and authentication mechanisms
5. **Automated Operations:** Minimize manual intervention through automated data synchronization and deployment


### 1.3 Report Structure


This report is organized as follows:


- **Sections 2–3** describe the final system architecture and technology choices
- **Sections 4–5** detail the core features and plugin system implementation
- **Section 6** documents significant technical challenges encountered and their resolutions
- **Sections 7–9** provide assessment, recommendations, and conclusions


---


## 2. System Architecture


### 2.1 High-Level Architecture


The Lumina platform implements a dual-interface architecture with separate but synchronized systems for students (mobile) and developers (web):


```
┌─────────────────────────────────────────────────────────────────────────┐
│                           LUMINA PLATFORM                                │
├───────────────────────────────────┬─────────────────────────────────────┤
│       STUDENT INTERFACE           │       DEVELOPER INTERFACE           │
│      (Mobile Application)         │        (Web Portal)                 │
├───────────────────────────────────┼─────────────────────────────────────┤
│                                   │                                     │
│  ┌─────────────────────────────┐  │  ┌─────────────────────────────┐   │
│  │    Lumina-Mobile-FE         │  │  │    lumina-web-fe            │   │
│  │    React Native + Expo      │  │  │    React + Material-UI      │   │
│  └──────────────┬──────────────┘  │  └──────────────┬──────────────┘   │
│                 │                 │                 │                   │
│  ┌──────────────▼──────────────┐  │  ┌──────────────▼──────────────┐   │
│  │    Lumina-Mobile-BE         │  │  │    lumina-web-be            │   │
│  │    Node.js + Express        │  │  │    Node.js + Express        │   │
│  │    Plugin Execution Engine  │  │  │    Plugin Management API    │   │
│  └──────────────┬──────────────┘  │  └──────────────┬──────────────┘   │
│                 │                 │                 │                   │
│  ┌──────────────▼──────────────┐  │  ┌──────────────▼──────────────┐   │
│  │    MongoDB (Cosmos DB)      │◄─┼──│    MongoDB (Cosmos DB)      │   │
│  │    Chatbots Collection      │  │  │    Plugins Collection       │   │
│  └─────────────────────────────┘  │  └─────────────────────────────┘   │
│                                   │                                     │
└───────────────────────────────────┴─────────────────────────────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │    Azure Timer Function       │
                   │    (60-second sync interval)  │
                   │    Web DB → Mobile DB         │
                   └───────────────────────────────┘
```


### 2.2 Component Overview


#### 2.2.1 Mobile Frontend (Lumina-Mobile-FE)


The student-facing mobile application provides:


- **Chatbot Discovery:** Browse available chatbots by category (Modules, Career, School, General)
- **Conversation Interface:** Rich chat interface with markdown rendering support
- **Conversation History:** Access and manage previous conversations
- **Favorites System:** Save preferred chatbots for quick access
- **Authentication:** Microsoft account login via Azure AD


**Directory Structure:**
```
Lumina-Mobile-FE/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── home.jsx       # Chatbot discovery
│   │   └── conversation-history.jsx
│   ├── chatbots/[id].jsx  # Chatbot details
│   ├── conversation/[id].jsx  # Chat interface
│   └── index.jsx          # Authentication entry
├── components/            # Reusable UI components
├── config/                # App configuration
└── context/               # React contexts
```


#### 2.2.2 Mobile Backend (Lumina-Mobile-BE)


The API server for the mobile application provides:


- **User Management:** User creation and preferences
- **Conversation Management:** CRUD operations for conversations
- **Message Handling:** Message storage and retrieval
- **AI Integration:** Azure OpenAI GPT-4o-mini for base chatbot
- **Plugin Execution:** Dynamic execution of third-party chatbot endpoints


**Directory Structure:**
```
Lumina-Mobile-BE/
├── controllers/
│   ├── user.controller.js
│   ├── conversation.controller.js
│   ├── message.controller.js
│   ├── openai.controller.js
│   ├── custom.controller.js    # Plugin execution engine
│   └── chatbot.controller.js
├── models/
│   ├── user.model.js
│   ├── conversation.model.js
│   ├── message.model.js
│   └── chatbot.model.js
├── routes/
└── index.js
```


#### 2.2.3 Web Frontend (lumina-web-fe)


The developer portal provides:


- **Plugin Creation Wizard:** 5-step guided plugin creation process
- **Plugin Management:** View, edit, activate, deactivate, and delete plugins
- **Endpoint Testing:** Test plugin endpoints before deployment
- **Dashboard:** Overview of developer's plugins and their status


**Directory Structure:**
```
lumina-web-fe/
├── src/
│   ├── screens/
│   │   ├── developer/
│   │   │   ├── create/Create.jsx    # Plugin creation wizard
│   │   │   └── plugin/              # Plugin management
│   │   └── global/                  # Shared screens
│   ├── components/
│   │   ├── create/                  # Creation wizard steps
│   │   ├── modal/                   # Dialog components
│   │   └── plugin/                  # Plugin display
│   ├── helpers/
│   └── config/
└── public/
```


#### 2.2.4 Web Backend (lumina-web-be)


The API server for the developer portal provides:


- **Plugin CRUD:** Create, read, update, delete plugins
- **Plugin Activation:** Control plugin availability
- **User Management:** Developer profile management
- **Image Storage:** Plugin image upload to Azure Blob Storage


**Directory Structure:**
```
lumina-web-be/
├── controllers/
│   ├── plugin.controller.js
│   └── user.controller.js
├── models/
│   ├── plugin.model.js
│   └── user.model.js
├── routes/
└── index.js
```


#### 2.2.5 Azure Timer Function (lumina-function)


An Azure Function that synchronizes plugin data:


- **Trigger:** Executes every 60 seconds
- **Source:** Web database (plugins collection)
- **Target:** Mobile database (chatbots collection)
- **Behavior:**
 - Activated plugins are upserted to mobile database
 - Deactivated plugins are removed from mobile database
 - Orphaned records in mobile database are cleaned up


### 2.3 Data Flow


#### 2.3.1 Plugin Deployment Flow


```
Developer → Web Portal → Web Backend → Web Database
                                           │
                                           ▼
                                   Azure Timer Function
                                           │
                                           ▼
Student ← Mobile App ← Mobile Backend ← Mobile Database
```


#### 2.3.2 Plugin Execution Flow


```
Student sends message
       │
       ▼
Mobile Frontend → Mobile Backend
       │
       ├─→ Is plugin chatbot?
       │           │
       │    Yes    ▼
       │    custom.controller.js
       │           │
       │           ▼
       │    Load OpenAPI schema
       │           │
       │           ▼
       │    Execute via swagger-client
       │           │
       │           ▼
       │    Forward auth headers (if configured)
       │           │
       │           ▼
       │    Return plugin response
       │
       └─→ Is base chatbot?
                   │
            Yes    ▼
            openai.controller.js
                   │
                   ▼
            Azure OpenAI API
                   │
                   ▼
            Return GPT response
```


---


## 3. Technology Stack


### 3.1 Mobile Frontend (Lumina-Mobile-FE)


| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React Native | 0.81.5 | Cross-platform mobile development |
| Platform | Expo SDK | 54.0.0 | Development and build tooling |
| Navigation | Expo Router | 6.0.14 | File-based routing |
| Styling | NativeWind | 2.0.11 | TailwindCSS for React Native |
| Authentication | expo-auth-session | 7.0.8 | Azure AD OAuth flow |
| HTTP Client | Axios | 1.7.7 | API communication |
| Markdown | react-native-markdown-display | 7.0.2 | AI response rendering |
| UI Runtime | React | 19.1.0 | Component framework |


### 3.2 Mobile Backend (Lumina-Mobile-BE)


| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Runtime | Node.js | LTS | Server environment |
| Framework | Express.js | 4.21.0 | Web framework |
| Database | MongoDB | 6.9.0 | Data persistence |
| ODM | Mongoose | 8.7.0 | MongoDB object modeling |
| API Execution | swagger-client | 3.32.2 | OpenAPI schema execution |
| YAML Parser | js-yaml | 4.1.0 | Schema parsing |
| HTTP Client | Axios | 1.7.7 | External API calls |


### 3.3 Web Frontend (lumina-web-fe)


| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 18.2.0 | UI framework |
| UI Library | Material-UI (MUI) | 6.1.3 | Component library |
| Authentication | @azure/msal-react | 2.2.0 | Azure AD integration |
| Routing | react-router-dom | 6.27.0 | Client-side routing |
| Notifications | react-toastify | 11.0.3 | Toast notifications |
| File Upload | FilePond | 4.32.1 | Image upload handling |
| Forms | Formik + Yup | 2.4.6 / 1.4.0 | Form management and validation |
| API Execution | swagger-client | 3.32.1 | Endpoint testing |


### 3.4 Web Backend (lumina-web-be)


| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Runtime | Node.js | LTS | Server environment |
| Framework | Express.js | 4.21.1 | Web framework |
| Database | MongoDB | 6.10.0 | Data persistence |
| ODM | Mongoose | 8.8.2 | MongoDB object modeling |
| CORS | cors | 2.8.5 | Cross-origin requests |
| API Execution | swagger-client | 3.32.0 | Schema validation |


### 3.5 Azure Services


| Service | Purpose |
|---------|---------|
| Azure App Service | Backend API hosting |
| Azure Static Web Apps | Web frontend hosting |
| Azure Cosmos DB (MongoDB API) | Database hosting |
| Azure Blob Storage | Plugin image storage |
| Azure Functions | Timer-based data synchronization |
| Azure AD (Microsoft Entra ID) | Identity and authentication |
| Azure OpenAI Service | GPT-4o-mini integration |


### 3.6 Development and Deployment


| Category | Technology | Purpose |
|----------|------------|---------|
| Version Control | Git | Source code management |
| CI/CD | GitHub Actions | Automated deployment |
| Package Manager | npm | Dependency management |
| Development Server | nodemon | Auto-restart on changes |


---


## 4. Core Features and Implementation


### 4.1 Mobile Application Features


#### 4.1.1 User Authentication


The mobile application implements Azure AD authentication using the expo-auth-session library:


- **Authentication Flow:** OAuth 2.0 Authorization Code flow with PKCE
- **Provider:** Microsoft Azure AD (Microsoft Entra ID)
- **Scope:** Configurable to NTU tenant or all Microsoft accounts
- **Session Management:** Token stored in app context for API requests


#### 4.1.2 Chatbot Discovery


Students can browse available chatbots through multiple views:


- **Home Screen:** Featured and recently used chatbots
- **Discovery Page:** Browse by category (Modules, Career, School, General)
- **Favorites:** Quick access to saved chatbots
- **Search:** Find chatbots by name or description


**Visual Design:**
- Custom card components with chatbot images
- Dynamic background colors for chatbots without images
- Category-based color coding


#### 4.1.3 Conversation Interface


The chat interface provides a rich messaging experience:


- **Message Display:** User messages on right, AI responses on left
- **Markdown Rendering:** Support for formatted AI responses including code blocks, lists, and emphasis
- **Conversation Persistence:** All messages saved to database
- **Context Preservation:** Conversation history maintained across sessions


#### 4.1.4 Conversation Management


- **History View:** List of all past conversations with timestamps
- **Resume Conversations:** Continue previous chats
- **Delete Conversations:** Remove unwanted conversation history
- **Conversation Metadata:** Shows chatbot name, last message, and date


### 4.2 Developer Portal Features


#### 4.2.1 Plugin Creation Wizard


A guided 5-step process for creating chatbot plugins:


**Step 1: Instructions**
- Overview of plugin requirements
- API contract specification
- Authentication options explained


**Step 2: Plugin Details**
- Plugin name and version
- Category selection
- Description (displayed to students)
- Optional image upload (stored in Azure Blob Storage)


**Step 3: Endpoint Configuration**
- Server URL (base URL of developer's API)
- Endpoint path (e.g., `/api/chat`, `/query`)
- Request format (JSON or plain text)
- Request body query key (e.g., `query`, `message`, `prompt`)
- Authentication type (None, API Key, Bearer Token)
- API key or token (if authentication required)


**Step 4: Test Endpoint**
- Live testing of configured endpoint
- Sample request/response display
- Error diagnostics


**Step 5: Review & Submit**
- Summary of all configuration
- Generated OpenAPI schema preview
- Submission confirmation


#### 4.2.2 Plugin Management


Developers can manage their plugins through the portal:


| Action | Description |
|--------|-------------|
| View | See plugin details and configuration |
| Edit | Modify plugin settings and endpoint |
| Activate | Enable plugin for student access |
| Deactivate | Temporarily disable plugin |
| Delete | Permanently remove plugin |
| Test | Re-test endpoint with current configuration |


#### 4.2.3 Dashboard


The developer dashboard provides:


- **Plugin Statistics:** Count of active/inactive plugins
- **Quick Actions:** Create new plugin, view all plugins
- **Status Overview:** At-a-glance view of plugin states


### 4.3 AI Integration


#### 4.3.1 Azure OpenAI (Base Chatbot)


The platform includes a built-in GPT-4o-mini chatbot:


- **Model:** GPT-4o-mini via Azure OpenAI Service
- **Context:** Conversation history included in API calls
- **Response Format:** Markdown-formatted text
- **Use Case:** General-purpose AI assistant for students


#### 4.3.2 Custom Plugin Chatbots


Third-party chatbots are executed through the plugin execution engine:


- **Schema:** OpenAPI 3.0.0 specification
- **Execution:** swagger-client library
- **Authentication:** Forwarded to plugin endpoint
- **Response:** Displayed with same formatting as base chatbot


---


## 5. Plugin System Architecture


### 5.1 Plugin Data Model


The plugin system uses a comprehensive schema that captures all information needed to execute external chatbot APIs:


**Plugin Schema (Web Database):**


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userEmail` | String | Yes | Developer's email |
| `userName` | String | Yes | Developer's display name |
| `name` | String | Yes | Plugin display name |
| `version` | String | Yes | Semantic version |
| `image` | String | No | Azure Blob Storage URL |
| `category` | String | Yes | Modules, Career, School, or General |
| `description` | String | Yes | Student-facing description |
| `activated` | Boolean | Yes | Availability status |
| `schema` | String | Yes | Generated OpenAPI 3.0.0 YAML |
| `endpoint` | String | Yes | Base server URL |
| `path` | String | Yes | API endpoint path |
| `requestBodyQueryKey` | String | No | JSON key for user message |
| `requestFormat` | String | No | json or text |
| `requestContentType` | String | No | Content-Type header value |
| `authType` | String | No | none, apiKey, or bearer |
| `apiKey` | String | No | Authentication credential |


### 5.2 OpenAPI Schema Generation


When a developer creates a plugin, the system generates an OpenAPI 3.0.0 specification:


```yaml
openapi: 3.0.0
info:
 title: [Plugin Name]
 version: [Plugin Version]
servers:
 - url: [Endpoint URL]
paths:
 [Path]:
   post:
     operationId: [Generated Operation ID]
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             properties:
               [requestBodyQueryKey]:
                 type: string
     responses:
       '200':
         description: Successful response
         content:
           application/json:
             schema:
               type: object
               properties:
                 response:
                   type: string
```


### 5.3 Plugin Execution Engine


The plugin execution engine (`custom.controller.js`) handles all third-party chatbot API calls:


#### 5.3.1 Request Processing


1. **Schema Loading:** Parse OpenAPI YAML specification
2. **Client Initialization:** Create swagger-client instance with auth configuration
3. **Path Resolution:** Extract endpoint path from schema (supports custom paths)
4. **Operation Identification:** Dynamically determine operationId from schema
5. **Request Building:** Construct request body with configured query key
6. **Execution:** Call external API via swagger-client
7. **Response Handling:** Return response to mobile frontend


#### 5.3.2 Authentication Forwarding


The execution engine supports three authentication methods:


| Auth Type | Header Format | Use Case |
|-----------|---------------|----------|
| `none` | No auth header | Public APIs |
| `apiKey` | `X-API-Key: [key]` | API key authentication |
| `bearer` | `Authorization: Bearer [token]` | OAuth/JWT tokens |


**Implementation:**
```javascript
if (authType === "apiKey" && apiKey) {
 req.headers["X-API-Key"] = apiKey;
} else if (authType === "bearer" && apiKey) {
 req.headers["Authorization"] = `Bearer ${apiKey}`;
}
```


#### 5.3.3 Request/Response Logging


The plugin execution engine includes structured logging for debugging and monitoring:


```javascript
const pluginLogger = {
 logRequest: (pluginName, path, requestData) => { ... },
 logResponse: (pluginName, path, response, duration) => { ... },
 logError: (pluginName, path, error, duration) => { ... }
};
```


**Logged Information:**
- Plugin name and path
- Request data (sanitized)
- Response duration in milliseconds
- Error details with stack traces


### 5.4 Data Synchronization


#### 5.4.1 Azure Timer Function


The synchronization function runs every 60 seconds and performs:


1. **Connect** to both web and mobile databases
2. **Fetch** all plugins from web database
3. **For each plugin:**
  - If `activated`: Upsert to mobile database
  - If not `activated`: Delete from mobile database
4. **Cleanup** orphaned records in mobile database
5. **Close** database connections


#### 5.4.2 Synchronized Fields


All plugin configuration fields are synchronized:


- `userEmail`, `userName`, `name`, `version`
- `image`, `category`, `description`
- `activated`, `schema`
- `endpoint`, `path`, `requestBodyQueryKey`
- `authType`, `apiKey`


#### 5.4.3 Synchronization Behavior


| Web Database State | Mobile Database Action |
|-------------------|----------------------|
| Plugin activated | Upsert (create or update) |
| Plugin deactivated | Delete from mobile DB |
| Plugin deleted | Delete from mobile DB (cleanup) |
| New plugin created | No action until activated |


### 5.5 Developer API Contract


Developers must implement endpoints that conform to this contract:


#### 5.5.1 Request Format (JSON)


```json
POST [endpoint][path]
Content-Type: application/json


{
 "[requestBodyQueryKey]": "user's message here"
}
```


**Example:**
```json
POST https://api.example.com/chat
Content-Type: application/json


{
 "query": "What courses are available for computer science?"
}
```


#### 5.5.2 Response Format


```json
{
 "response": "The chatbot's reply text here"
}
```


The `response` field is displayed to the student in the mobile app with markdown rendering.


#### 5.5.3 Authentication


If authentication is configured:


| Auth Type | Expected Header |
|-----------|-----------------|
| `apiKey` | `X-API-Key: [configured key]` |
| `bearer` | `Authorization: Bearer [configured token]` |


---


## 6. Technical Challenges and Resolutions


This section documents significant technical challenges encountered during development and the solutions implemented.


### 6.1 Infinite Rendering Loop


**Severity:** Critical
**Component:** Mobile Frontend (`conversation/[id].jsx`)


**Problem Description:**
The mobile app conversation page entered an infinite rendering loop, causing:
- Application freeze and unresponsiveness
- Excessive battery drain
- Database inconsistencies from repeated operations
- Failed conversation creation


**Root Cause Analysis:**
1. Improper `useEffect` dependency arrays causing cascading re-renders
2. Database save operations failing silently
3. Error handling not preventing continued execution
4. State updates triggering additional effect executions


**Resolution:**
- Complete refactoring of `conversation/[id].jsx`
- Proper state management with functional updates
- Error boundaries and graceful degradation
- Debounced database operations


---


### 6.2 Hardcoded Endpoint Path


**Severity:** Critical
**Component:** Mobile Backend (`custom.controller.js`)


**Problem Description:**
The initial plugin execution engine hardcoded the endpoint path to `/getResponse`:
```javascript
// BEFORE (Hardcoded)
const operation = client.spec.paths["/getResponse"];
operationId: "getResponse";
```


This forced all third-party developers to structure their APIs with this exact path, severely limiting integration flexibility.


**Resolution:**
Dynamic path and operationId extraction:
```javascript
// AFTER (Dynamic)
const pathKey = path || "/getResponse"; // Backward compatible
const operation = client.spec.paths[pathKey];
const operationId = postOperation?.operationId || "getResponse";
```


**Impact:**
- Developers can now use any endpoint path
- Backward compatible with existing plugins
- Improved integration flexibility


---


### 6.3 API Key Forwarding


**Severity:** Critical
**Component:** Mobile Backend (`custom.controller.js`)


**Problem Description:**
API keys configured in the developer portal were stored but never sent to plugin endpoints, leaving external APIs unable to authenticate requests from Lumina.


**Resolution:**
Implemented `requestInterceptor` pattern in swagger-client:
```javascript
requestInterceptor: (req) => {
 if (authType === "apiKey" && apiKey) {
   req.headers["X-API-Key"] = apiKey;
 } else if (authType === "bearer" && apiKey) {
   req.headers["Authorization"] = `Bearer ${apiKey}`;
 }
 return req;
}
```


---


### 6.4 Concurrent Promise Execution


**Severity:** High
**Component:** Mobile Frontend (`CustomConversation.jsx`)


**Problem:**
Incorrect `Promise.all` usage resulted in only the first promise being executed:
```javascript
// INCORRECT - Only first promise executed
await Promise.all(
 axios.delete("/conversation/" + id),
 axios.delete("/message/conversation/" + id)
);
```


**Impact:** Orphaned messages left in database when conversations deleted.


**Fix:**
```javascript
// CORRECT - Array syntax
await Promise.all([
 axios.delete("/conversation/" + id),
 axios.delete("/message/conversation/" + id)
]);
```


---


### 6.5 Stale Closure in State Management


**Severity:** High
**Component:** Mobile Frontend (`conversation/[id].jsx`)


**Problem:**
The `getResponse` callback captured stale `messages` state, causing GPT-4o to receive incomplete conversation history (missing the latest user message).


**Resolution:**
Used functional state updates to access latest state:
```javascript
setMessages((prevMessages) => {
 const messagesToSend = prevMessages.filter(...);
 return [...prevMessages, newMessage];
});
```


---


### 6.6 Image Upload Pipeline


**Severity:** High
**Component:** Web Backend (`plugin.controller.js`)


**Problems:**
1. Hardcoded SAS token that would expire
2. Missing filename handling from frontend
3. Base64 data URL not properly converted to binary


**Solutions:**
1. Environment variable for SAS token (`AZURE_BLOB_SAS_TOKEN`)
2. Auto-generate unique filenames with `crypto.randomBytes()`
3. Proper base64 parsing helper function


---


### 6.7 Additional Resolved Issues


| Issue | Component | Problem | Resolution |
|-------|-----------|---------|------------|
| Payload too large | Web Backend | Image uploads exceeding limit | Increased Express payload limit |
| Pagination order | Web Frontend | Sort applied after pagination | Fixed query order |
| Infinite loading | Plugin Details | Loading spinner never stopped | Added timeout handling |
| Navigation | Mobile App | Incorrect back navigation | Router configuration fix |
| Redirect URI | Web Frontend | Auth redirect failures | MSAL configuration update |
| Console logs | Various | Debug logs in production | Log cleanup |
| Source maps | Web Frontend | Maps exposed in production | Build configuration update |


---


## 7. Current State Assessment


### 7.1 Platform Capabilities


The Lumina platform currently provides the following capabilities:


#### 7.1.1 Student Features (Mobile App)


| Feature | Status | Description |
|---------|--------|-------------|
| Azure AD Login | ✅ Complete | Microsoft account authentication |
| Chatbot Discovery | ✅ Complete | Browse and search available chatbots |
| Category Filtering | ✅ Complete | Filter by Modules, Career, School, General |
| Favorites | ✅ Complete | Save preferred chatbots |
| Conversations | ✅ Complete | Chat with AI chatbots |
| Conversation History | ✅ Complete | View and resume past conversations |
| Markdown Rendering | ✅ Complete | Rich text display for AI responses |
| GPT-4o-mini | ✅ Complete | Built-in general-purpose AI assistant |
| Third-party Plugins | ✅ Complete | Execute external chatbot APIs |


#### 7.1.2 Developer Features (Web Portal)


| Feature | Status | Description |
|---------|--------|-------------|
| Azure AD Login | ✅ Complete | Microsoft account authentication |
| Plugin Creation | ✅ Complete | 5-step guided wizard |
| Endpoint Testing | ✅ Complete | Test before deployment |
| Plugin Management | ✅ Complete | Edit, activate, deactivate, delete |
| Image Upload | ✅ Complete | Azure Blob Storage integration |
| Authentication Config | ✅ Complete | API Key and Bearer token support |
| Dynamic Paths | ✅ Complete | Custom endpoint paths |
| Dashboard | ✅ Complete | Plugin statistics overview |


#### 7.1.3 Infrastructure


| Component | Status | Description |
|-----------|--------|-------------|
| Mobile Backend | ✅ Deployed | Azure App Service |
| Web Backend | ✅ Deployed | Azure App Service |
| Web Frontend | ✅ Deployed | Azure Static Web Apps |
| Database | ✅ Deployed | Azure Cosmos DB (MongoDB API) |
| Blob Storage | ✅ Deployed | Plugin image storage |
| Timer Function | ✅ Deployed | 60-second sync interval |
| CI/CD | ✅ Configured | GitHub Actions workflows |


### 7.2 API Endpoints


#### 7.2.1 Mobile Backend API


| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/user` | POST | Create user |
| `/user/:id` | GET | Get user |
| `/conversation` | POST/GET | Conversation CRUD |
| `/message` | POST/GET | Message CRUD |
| `/openai` | POST | GPT-4o chat |
| `/custom` | POST | Plugin execution |


#### 7.2.2 Web Backend API


| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/plugin` | POST/GET | Plugin CRUD |
| `/plugin/:id` | GET/PUT/DELETE | Single plugin operations |
| `/plugin/:id/activate` | PUT | Activate plugin |
| `/plugin/:id/deactivate` | PUT | Deactivate plugin |
| `/user` | POST/GET | User management |


### 7.3 Code Organization


#### 7.3.1 Web Frontend Structure


```
src/
├── components/
│   ├── create/          # Plugin creation components
│   ├── modal/           # Modal dialogs
│   ├── plugin/          # Plugin display components
│   └── dashboard/       # Dashboard widgets
├── screens/
│   ├── global/          # Shared screens
│   └── developer/       # Developer-specific screens
├── helpers/             # Utility functions
└── config/              # Configuration files
```


#### 7.3.2 Mobile Frontend Structure


```
app/
├── (tabs)/              # Tab-based navigation screens
├── chatbots/            # Chatbot detail screens
├── conversation/        # Chat interface screens
├── components/          # Reusable UI components
├── config/              # Configuration files
└── context/             # React context providers
```


#### 7.3.3 Backend Structure (Both)


```
├── controllers/         # Route handlers
├── models/              # Database schemas
├── routes/              # API route definitions
├── middleware/          # Express middleware
└── config/              # Configuration files
```


### 7.4 Known Limitations


| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| No offline support | Requires internet connection | Implement local caching |
| Single response format | Limited to `response` field | Support multiple response schemas |
| No conversation export | Cannot save conversations externally | Add export functionality |
| No analytics dashboard | Limited visibility into usage | Implement usage tracking |
| No rate limiting | Potential API abuse | Add request throttling |
| No plugin versioning | Cannot rollback changes | Implement version history |
---


## 8. Future Recommendations


### 8.1 Security Enhancements


| Recommendation | Priority | Description |
|----------------|----------|-------------|
| JWT Validation | High | Implement backend API protection with JWT tokens |
| API Key Encryption | High | Encrypt stored API keys at rest |
| Rate Limiting | Medium | Add request throttling to prevent abuse |
| Input Validation | Medium | Comprehensive validation on all endpoints |
| HTTPS Enforcement | Medium | Ensure all communications use TLS |


### 8.2 Feature Additions


| Feature | Priority | Description |
|---------|----------|-------------|
| Analytics Dashboard | High | Usage statistics for developers |
| Conversation Context | High | Send conversation history to plugins |
| Plugin Versioning | Medium | Version history and rollback capability |
| Webhook System | Medium | Real-time event notifications |
| Multi-language Support | Low | Internationalization support |
| Voice Input/Output | Low | Speech-to-text and text-to-speech |


### 8.3 Developer Experience


| Improvement | Priority | Description |
|-------------|----------|-------------|
| API Documentation | High | Swagger/OpenAPI documentation for platform APIs |
| SDK Libraries | Medium | Client libraries for common languages |
| Sandbox Environment | Medium | Testing environment for plugin development |
| Error Diagnostics | Medium | Enhanced error messages and debugging tools |
| Plugin Templates | Low | Starter templates for common use cases |


### 8.4 Infrastructure


| Improvement | Priority | Description |
|-------------|----------|-------------|
| Automated Testing | High | Unit and integration test suites |
| Monitoring | High | Application performance monitoring |
| Logging Aggregation | Medium | Centralized log management |
| Backup Strategy | Medium | Database backup and recovery procedures |
| Multi-region Deployment | Low | Geographic redundancy |


### 8.5 Technical Debt Resolution


| Item | Priority | Effort |
|------|----------|--------|
| Remove console logs | Low | Low |
| Environment variable management | Medium | Medium |
| Input validation | Medium | Medium |
| Automated test suite | High | High |
| API documentation | Medium | Medium |
---


## 9. Conclusion


### 9.1 Summary of Accomplishments


The Lumina platform has been developed as a comprehensive plugin-based chatbot hosting solution for Nanyang Technological University. The platform successfully delivers:


1. **Dual-Interface Architecture:** A mobile application for students and a web portal for developers, each optimized for their respective user experiences.


2. **Plugin System:** Third-party developers can deploy custom chatbots with flexible endpoint configuration, multiple authentication methods, and automatic deployment to the mobile application.


3. **Azure Cloud Integration:** The platform leverages Azure services including:
  - Azure AD for authentication
  - Azure OpenAI for GPT-4o-mini
  - Azure Cosmos DB for data persistence
  - Azure Blob Storage for images
  - Azure App Service for backend hosting
  - Azure Static Web Apps for frontend hosting
  - Azure Functions for data synchronization


4. **Developer Experience:** A guided 5-step plugin creation wizard, endpoint testing capabilities, and comprehensive documentation enable third-party integration.


5. **Student Experience:** Chatbot discovery, conversation management, favorites, and markdown-rendered AI responses provide a rich user experience.


### 9.2 Technical Achievements


| Achievement | Description |
|-------------|-------------|
| OpenAPI Integration | Dynamic schema generation and execution via swagger-client |
| Authentication Forwarding | Support for API Key and Bearer token authentication |
| Real-time Sync | 60-second synchronization between web and mobile databases |
| Cross-platform | React Native mobile app with Expo SDK |
| Modern Web Stack | React 18 with Material-UI component library |


### 9.3 Lessons Learned


1. **State Management Complexity:** React Native's state management with useEffect hooks requires careful attention to prevent infinite loops and stale closures.


2. **Backward Compatibility:** All improvements maintained backward compatibility with existing configurations, using sensible defaults.


3. **Error Feedback Importance:** Silent failures in production led to poor user experience; toast notifications and proper error handling significantly improved developer experience.


4. **Documentation Value:** Clear API contracts and deployment guides are essential for third-party developer adoption.


### 9.4 Final Assessment


The Lumina platform has achieved its primary objectives of providing a unified chatbot ecosystem for NTU. The platform is capable of hosting third-party chatbots and serving students through the mobile application. While there are areas for improvement, particularly in security and analytics, the foundation is solid and positioned for continued growth and enhancement based on user feedback and emerging requirements.


---


**End of Report**








