​​# Lumina System Architecture & Documentation


## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Data Flow](#data-flow)
5. [Plugin System](#plugin-system)
6. [Authentication](#authentication)
7. [Deployment](#deployment)
8. [API Reference](#api-reference)
9. [User Workflows](#user-workflows)
10. [Development Guide](#development-guide)


---


## 🎯 System Overview


**Lumina** is an Open Innovation Ecosystem for Scalable and Evolutional Educational Mobile Chatbot designed for NTU (Nanyang Technological University) students and developers.


### Purpose
- **For Students**: Access multiple specialized AI chatbots (plugins) through a mobile app
- **For Developers**: Create, deploy, and manage custom LLM-powered chatbots via a web portal


### Key Features
- 🤖 **Multiple AI Chatbots**: Access various specialized chatbots for different purposes
- 💬 **GPT-4o-mini Integration**: Base model for general queries
- 🔌 **Plugin System**: Developers can deploy custom LLM backends as plugins
- ❤️ **Favorites**: Students can favorite frequently used chatbots
- 📜 **Conversation History**: Review and manage past conversations
- 🔭 **Centralized Management**: Developers manage all plugins from one portal
- 💡 **Endpoint Testing**: Test plugin endpoints before deployment


---


## 🏗️ Architecture


### High-Level Architecture


```
┌─────────────────────────────────────────────────────────────────┐
│                         LUMINA ECOSYSTEM                         │
├─────────────────────────────────┬───────────────────────────────┤
│         MOBILE APP              │         WEB PORTAL            │
│    (Student Interface)          │    (Developer Interface)      │
├─────────────────────────────────┼───────────────────────────────┤
│  Lumina-Mobile-FE               │  lumina-web-fe                │
│  - React Native (Expo)          │  - React                      │
│  - iOS & Android                │  - Material-UI                │
│  - Azure AD Auth                │  - Azure AD Auth              │
│                                 │                               │
│  Lumina-Mobile-BE               │  lumina-web-be                │
│  - Node.js/Express              │  - Node.js/Express            │
│  - MongoDB (Cosmos DB)          │  - MongoDB (Cosmos DB)        │
│  - Azure OpenAI Integration     │  - Azure Blob Storage         │
│  - Plugin Execution Engine      │  - Plugin Management          │
└─────────────────────────────────┴───────────────────────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │   SHARED INFRASTRUCTURE   │
                   ├───────────────────────────┤
                   │ - Azure AD (Auth)         │
                   │ - MongoDB/Cosmos DB       │
                   │ - Azure OpenAI (GPT-4o)   │
                   │ - Azure Blob Storage      │
                   │ - Azure App Services      │
                   │ - Azure Static Web Apps   │
                   └───────────────────────────┘
```


### Technology Stack


#### Mobile Frontend (Lumina-Mobile-FE)
- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **Styling**: TailwindCSS (NativeWind)
- **Authentication**: expo-auth-session with Azure AD
- **HTTP Client**: Axios
- **State Management**: React Context API


#### Web Frontend (lumina-web-fe)
- **Framework**: React 19.1.0
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **Authentication**: @azure/msal-react (MSAL)
- **HTTP Client**: Axios
- **State Management**: React Context API


#### Mobile Backend (Lumina-Mobile-BE)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Azure Cosmos DB)
- **AI Integration**: Azure OpenAI (GPT-4o-mini)
- **Plugin Engine**: swagger-client + js-yaml
- **ODM**: Mongoose


#### Web Backend (lumina-web-be)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Azure Cosmos DB)
- **File Storage**: Azure Blob Storage
- **ODM**: Mongoose


---


## 🧩 Components


### 1. Mobile App (Student-Facing)


#### Purpose
Allows NTU students to interact with AI chatbots (plugins) for various educational purposes.


#### Main Screens


**Login Screen** (`app/index.jsx`)
- Azure AD authentication with NTU account
- Validates user email
- Creates user in database if first login


**Home Screen** (`app/(tabs)/home.jsx`)
- Displays favorite chatbots (quick access)
- Shows discover chatbots (browse available plugins)
- Refresh functionality
- Sign out option


**Conversation History** (`app/(tabs)/conversation-history.jsx`)
- Lists all past conversations
- Sorted by most recent
- Swipe to delete conversations
- Create new conversation


**Chatbot Details** (`app/chatbots/[id].jsx`)
- View chatbot information (name, version, description, category)
- Add/remove from favorites
- Start conversation with chatbot


**Conversation Screen** (`app/conversation/[id].jsx`)
- Chat interface with selected chatbot
- Real-time message exchange
- Supports both GPT-4o-mini and custom plugins
- Message history persistence


#### Navigation Structure
```
app/
├── index.jsx                    # Login screen
├── _layout.jsx                  # Root layout with providers
├── (tabs)/                      # Tab navigation
│   ├── _layout.jsx             # Tab bar configuration
│   ├── home.jsx                # Home screen
│   └── conversation-history.jsx # History screen
├── chatbots/
│   ├── [id].jsx                # Chatbot details
│   ├── discover.jsx            # Browse all chatbots
│   └── favourites.jsx          # Favorite chatbots
└── conversation/
   └── [id].jsx                # Chat screen
```


---


### 2. Web Portal (Developer-Facing)


#### Purpose
Allows developers to create, manage, and deploy custom AI chatbot plugins.


#### Main Screens


**Login Screen** (`src/screens/global/auth/Login.jsx`)
- Azure AD authentication
- Validates NTU email (@e.ntu.edu.sg)
- Creates user with "Developer" or "Admin" domain
- Redirects to plugin management


**View Plugins** (`src/screens/developer/plugin/PluginDev.jsx`)
- Lists all plugins created by the developer
- Filter by status (Active/Inactive)
- Search functionality
- Click to view details


**Plugin Details** (`src/screens/developer/plugin/PluginDetailsDev.jsx`)
- View plugin information
- Edit plugin configuration
- Test plugin endpoint
- Activate/deactivate plugin
- Delete plugin
- View OpenAPI schema (YAML)


**Create Plugin** (`src/screens/developer/create/Create.jsx`)
- Multi-step wizard:
 1. Instructions
 2. Enter plugin details (name, description, category, image)
 3. Enter endpoint configuration
 4. Test endpoint
 5. Review and submit
- Generates OpenAPI 3.0.0 schema
- Uploads image to Azure Blob Storage


**Profile** (`src/screens/global/profile/Profile.jsx`)
- View user information
- Manage account settings


**Contributors** (`src/screens/admin/contributor/Contributor.jsx`)
- Admin-only screen
- View all developers
- Manage contributor access


#### Navigation Structure
```
src/
├── App.js                       # Main app with routing
├── screens/
│   ├── global/
│   │   ├── auth/Login.jsx      # Login screen
│   │   ├── profile/Profile.jsx # Profile screen
│   │   ├── Topbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Side navigation menu
│   │   └── NotFound.jsx        # 404 page
│   ├── developer/
│   │   ├── plugin/
│   │   │   ├── PluginDev.jsx   # Plugin list
│   │   │   └── PluginDetailsDev.jsx # Plugin details
│   │   └── create/Create.jsx   # Create plugin wizard
│   └── admin/
│       └── contributor/Contributor.jsx # Admin panel
```


---


### 3. Mobile Backend (Lumina-Mobile-BE)


#### Purpose
Handles mobile app requests, manages conversations, integrates with Azure OpenAI, and executes custom plugins.


#### API Endpoints


**User Routes** (`/user`)
- `GET /:id` - Get user by ID
- `GET /email/:email` - Get user by email
- `POST /` - Create new user
- `PUT /email/:email` - Update user (favorite chatbots)
- `DELETE /email/:email` - Delete user


**Chatbot Routes** (`/chatbot`)
- `GET /` - Get all chatbots (plugins)
- `GET /:id` - Get chatbot by ID
- `POST /` - Create chatbot (testing only)
- `PUT /:id` - Update chatbot


**Conversation Routes** (`/conversation`)
- `GET /email/:email` - Get all conversations for user
- `POST /` - Create new conversation
- `PUT /:id` - Update conversation (last message)
- `DELETE /:id` - Delete conversation


**Message Routes** (`/message`)
- `GET /conversation/:conversationId` - Get all messages in conversation
- `GET /:id` - Get message by ID
- `POST /` - Create new message
- `DELETE /:id` - Delete message
- `DELETE /conversation/:conversationId` - Delete all messages in conversation


**OpenAI Routes** (`/openai`)
- `POST /` - Get response from Azure OpenAI (GPT-4o-mini)


**Custom Routes** (`/custom`)
- `POST /` - Execute custom plugin endpoint


#### Database Models


**User Model**
```javascript
{
 email: String,
 favourite_chatbot: [Chatbot]  // Embedded chatbot documents
}
```


**Chatbot Model** (Plugin)
```javascript
{
 userEmail: String,
 userName: String,
 name: String,
 version: String,
 image: String,
 category: String,
 description: String,
 activated: Boolean,
 schema: String  // OpenAPI YAML schema
}
```


**Conversation Model**
```javascript
{
 userEmail: String,
 chatbotId: String,
 firstMessage: String,
 lastMessage: String,
 chatbotName: String,
 timestamps: true
}
```


**Message Model**
```javascript
{
 conversationId: String,
 fromSelf: Boolean,  // true = user, false = AI
 content: String,
 timestamps: true
}
```


---


### 4. Web Backend (lumina-web-be)


#### Purpose
Handles web portal requests, manages plugins, and stores plugin images.


#### API Endpoints


**User Routes** (`/user`)
- `GET /` - Get all users
- `GET /email/:email` - Get user by email
- `POST /` - Create new user
- `PUT /:id` - Update user


**Plugin Routes** (`/plugin`)
- `GET /` - Get all plugins
- `GET /email/:email` - Get plugins by developer email
- `GET /:id` - Get plugin by ID
- `POST /` - Create new plugin (uploads image to Azure Blob)
- `PUT /:id` - Update plugin
- `DELETE /:id` - Delete plugin


#### Database Models


**User Model**
```javascript
{
 name: String,
 email: String,
 domain: String  // "Developer" or "Admin"
}
```


**Plugin Model**
```javascript
{
 userEmail: String,
 userName: String,
 name: String,
 version: String,
 image: String,  // Azure Blob Storage URL
 category: String,
 description: String,
 activated: Boolean,
 schema: String,  // OpenAPI YAML
 endpoint: String,
 path: String,
 requestBodyQueryKey: String,
 requestFormat: String,
 requestContentType: String,
 authType: String,
 apiKey: String
}
```


---


## 🔄 Data Flow


### 1. Student Uses Mobile App


#### Login Flow
```
1. Student opens app → Login screen
2. Clicks "Sign in with Microsoft"
3. Azure AD authentication (OAuth 2.0)
4. App receives ID token with user email
5. App checks if user exists in database
6. If not, creates new user with email
7. Redirects to Home screen
```


#### Chat Flow (GPT-4o-mini)
```
1. Student selects "Lumina GPT-4o" (chatbotId = "0")
2. Student types message
3. App creates conversation (if first message)
4. App saves user message to database
5. App sends messages to /openai endpoint
6. Backend calls Azure OpenAI API
7. Backend receives AI response
8. Backend saves AI message to database
9. App displays AI response
10. Conversation continues...
```


#### Chat Flow (Custom Plugin)
```
1. Student selects custom chatbot
2. Student types message
3. App creates conversation (if first message)
4. App saves user message to database
5. App sends message + plugin schema to /custom endpoint
6. Backend parses OpenAPI schema (YAML)
7. Backend initializes SwaggerClient with schema
8. Backend calls plugin's external API endpoint
9. Backend receives plugin response
10. Backend saves AI message to database
11. App displays plugin response
12. Conversation continues...
```


#### Favorite Chatbot Flow
```
1. Student views chatbot details
2. Clicks favorite/unfavorite button
3. App updates user's favourite_chatbot array
4. App sends PUT request to /user/email/:email
5. Backend updates user document in MongoDB
6. Chatbot appears in/removed from favorites list
```


---


### 2. Developer Uses Web Portal


#### Login Flow
```
1. Developer opens web portal
2. Clicks "Sign in with Microsoft"
3. Azure AD authentication (popup)
4. Portal validates email ends with @e.ntu.edu.sg
5. Portal checks if user exists in database
6. If not, creates user with domain "Developer"
7. Sets active account in MSAL
8. Redirects to View Plugins page
```


#### Create Plugin Flow
```
1. Developer clicks "Create Plugin"
2. Step 1: Reads instructions
3. Step 2: Enters plugin details
  - Name, description, category
  - Uploads image (converted to base64)
4. Step 3: Enters endpoint configuration
  - Endpoint URL
  - Path
  - Request format (application/json, text/plain, etc.)
  - Request body query key
5. Step 4: Tests endpoint
  - Portal sends test request
  - Displays response
6. Step 5: Reviews all information
7. Clicks submit
8. Portal generates OpenAPI 3.0.0 YAML schema
9. Portal uploads image to Azure Blob Storage
10. Portal creates plugin in database
11. Plugin is now available in mobile app
```


#### Edit Plugin Flow
```
1. Developer clicks on plugin
2. Views plugin details
3. Clicks "Edit" button
4. Modifies fields (name, description, endpoint, etc.)
5. Clicks "Save"
6. Portal updates plugin in database
7. Changes reflected in mobile app
```


#### Activate/Deactivate Plugin Flow
```
1. Developer views plugin details
2. Clicks "Activate" or "Deactivate"
3. Portal updates plugin.activated field
4. If activated: Plugin appears in mobile app
5. If deactivated: Plugin hidden from mobile app
```


---


## 🔌 Plugin System


### What is a Plugin?


A **plugin** (also called "chatbot" in the mobile app) is a custom LLM-powered backend that developers can integrate into Lumina. Each plugin:
- Has its own external API endpoint
- Follows OpenAPI 3.0.0 specification
- Can be activated/deactivated
- Appears as a chatbot in the mobile app


### Plugin Architecture


```
┌─────────────────────────────────────────────────────────────┐
│                    PLUGIN LIFECYCLE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CREATION (Web Portal)                                    │
│     Developer creates plugin with:                           │
│     - Name, description, category, image                     │
│     - External API endpoint URL                              │
│     - Request/response configuration                         │
│     - OpenAPI schema generated automatically                 │
│                                                              │
│  2. STORAGE (Web Backend)                                    │
│     - Plugin metadata stored in MongoDB                      │
│     - Image uploaded to Azure Blob Storage                   │
│     - OpenAPI schema stored as YAML string                   │
│                                                              │
│  3. SYNCHRONIZATION                                          │
│     - Mobile backend fetches activated plugins               │
│     - Plugins appear as chatbots in mobile app               │
│                                                              │
│  4. EXECUTION (Mobile Backend)                               │
│     When student sends message:                              │
│     - Backend parses plugin's OpenAPI schema                 │
│     - SwaggerClient initializes with schema                  │
│     - Backend calls plugin's external endpoint               │
│     - Response returned to student                           │
│                                                              │
│  5. MANAGEMENT (Web Portal)                                  │
│     Developer can:                                           │
│     - Edit plugin configuration                              │
│     - Test endpoint                                          │
│     - Activate/deactivate                                    │
│     - Delete plugin                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```


### OpenAPI Schema Structure


Plugins use OpenAPI 3.0.0 specification. Example schema:


```yaml
openapi: 3.0.0
info:
 title: Career Advisor API
 version: 1.0.0
servers:
 - url: https://career-advisor-api.example.com
paths:
 /getResponse:
   post:
     operationId: getResponse
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             properties:
               query:
                 type: string
     responses:
       200:
         content:
           application/json:
             schema:
               type: string
```


### Plugin Execution Flow


```javascript
// Mobile Backend: custom.controller.js


1. Receive request with message and schema
2. Parse YAML schema using js-yaml
3. Initialize SwaggerClient with parsed schema
4. Extract operation details from schema
5. Call external API using SwaggerClient
6. Return response to mobile app
```


### Plugin Categories


Common plugin categories:
- **Planning**: Career advisors, course recommenders
- **Modules**: Course-specific chatbots, FYP helpers
- **Academic**: Study assistants, research helpers
- **Administrative**: Campus navigation, event information
- **General**: Miscellaneous utilities


---


## 🔐 Authentication


### Azure AD Integration


Both mobile and web apps use **Azure Active Directory (Microsoft Entra ID)** for authentication.


#### Mobile App Authentication


**Technology**: `expo-auth-session` with OAuth 2.0 / OpenID Connect


**Flow**:
```
1. User clicks "Sign in with Microsoft"
2. App opens browser with Azure AD login page
3. User enters NTU credentials
4. Azure AD validates credentials
5. Azure AD redirects to app with authorization code
6. App exchanges code for tokens (ID token, access token)
7. App extracts user email from ID token
8. App stores email in context
9. User navigated to home screen
```


**Configuration** (`Lumina-Mobile-FE/config/authConfig.js`):
```javascript
{
 clientId: "71519bba-3a1e-4a1c-9924-49754f9e992c",
 tenantId: "0f8289d7-df22-4c3e-89b7-0fb1bcea61ab",
 authority: "https://login.microsoftonline.com/common/v2.0",
 scopes: ["openid", "profile", "email", "User.Read"],
 redirectScheme: "com.lumina"
}
```


**Redirect URI**: `msal{clientId}://auth`


#### Web Portal Authentication


**Technology**: `@azure/msal-react` (MSAL Browser)


**Flow**:
```
1. User clicks "Sign in with Microsoft"
2. MSAL opens popup with Azure AD login
3. User enters NTU credentials (@e.ntu.edu.sg)
4. Portal validates email domain
5. If invalid domain, shows error and redirects
6. If valid, creates/fetches user from database
7. Sets active account in MSAL instance
8. User navigated to plugin management
```


**Configuration** (`lumina-web-fe/src/config.js`):
```javascript
{
 clientId: "3c79dd79-7c34-4cda-9973-25849a553f51",
 tenantId: "0f8289d7-df22-4c3e-89b7-0fb1bcea61ab",
 authority: "https://login.microsoftonline.com/common",
 redirectUri: "https://ashy-moss-01833a500.3.azurestaticapps.net",
 scopes: ["User.Read", "openid", "email", "profile"]
}
```


#### Protected Routes


**Mobile App**: Uses React Context to check if user is logged in
**Web Portal**: Uses `ProtectedRoute` component with MSAL


```javascript
// Web Portal: ProtectedRoute.js
const ProtectedRoute = ({ children }) => {
 const { instance } = useMsal();
 const isAuthenticated = instance.getActiveAccount() !== null;
 return isAuthenticated ? children : <Navigate to="/" />;
};
```


#### User Roles


**Mobile App**: All users are students (no role differentiation)
**Web Portal**:
- **Developer**: Can create and manage own plugins
- **Admin**: Can view all contributors and manage system


---


## 🚀 Deployment


### Current Deployment Architecture


```
┌─────────────────────────────────────────────────────────────┐
│                    AZURE CLOUD SERVICES                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Mobile Frontend                                             │
│  └─ Expo App (iOS/Android)                                   │
│     - Distributed via Expo Go / EAS Build                    │
│     - No cloud hosting (runs on device)                      │
│                                                              │
│  Mobile Backend                                              │
│  └─ Azure App Service                                        │
│     URL: lumina-mobile-be-cahcaybjbbhxdzf4                   │
│          .southeastasia-01.azurewebsites.net                 │
│     Region: Southeast Asia                                   │
│                                                              │
│  Web Frontend                                                │
│  └─ Azure Static Web Apps                                    │
│     URL: ashy-moss-01833a500.3.azurestaticapps.net          │
│     Auto-deploy: GitHub Actions                              │
│                                                              │
│  Web Backend                                                 │
│  └─ Azure App Service                                        │
│     URL: lumina-web-be-deh3gwc0fre2hjgz                      │
│          .southeastasia-01.azurewebsites.net                 │
│     Region: Southeast Asia                                   │
│                                                              │
│  Database                                                    │
│  └─ Azure Cosmos DB (MongoDB API)                            │
│     - Shared by both backends                                │
│     - Connection via MONGODB_URI env variable                │
│                                                              │
│  File Storage                                                │
│  └─ Azure Blob Storage                                       │
│     Container: plugin-images                                 │
│     - Stores plugin images                                   │
│                                                              │
│  AI Service                                                  │
│  └─ Azure OpenAI                                             │
│     Model: GPT-4o-mini                                       │
│     - Used for general chat (chatbotId = "0")                │
│                                                              │
│  Authentication                                              │
│  └─ Azure Active Directory (Entra ID)                        │
│     Tenant: 0f8289d7-df22-4c3e-89b7-0fb1bcea61ab            │
│     - Mobile App Registration                                │
│     - Web App Registration                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```


### Environment Variables


#### Mobile Backend (Lumina-Mobile-BE)
```env
PORT=3002
MONGODB_URI=<Azure Cosmos DB connection string>
AZURE_OPENAI_API_BASE=<Azure OpenAI endpoint>
AZURE_OPENAI_APIVERSION=<API version>
AZURE_OPENAI_APIKEY=<API key>
```


#### Web Backend (lumina-web-be)
```env
PORT=8080
MONGODB_URI=<Azure Cosmos DB connection string>
```


### Deployment Process


#### Mobile Frontend
```bash
# Development (local testing)
cd Lumina-Mobile-FE
npm install
npx expo start


# Production (build for app stores)
eas build --platform ios
eas build --platform android
```


#### Web Frontend
```bash
# Automatic deployment via GitHub Actions
# Push to main branch → triggers build → deploys to Azure Static Web Apps


# Manual deployment
cd lumina-web-fe
npm install
npm run build
# Upload build/ to Azure Static Web Apps
```


#### Backends
```bash
# Deploy to Azure App Service
# Option 1: GitHub Actions (CI/CD)
# Option 2: Azure CLI
az webapp up --name lumina-mobile-be --resource-group <rg>
az webapp up --name lumina-web-be --resource-group <rg>


# Option 3: VS Code Azure Extension
```


---


## 📚 API Reference


### Mobile Backend API


**Base URL**: `https://lumina-mobile-be-cahcaybjbbhxdzf4.southeastasia-01.azurewebsites.net`


#### User Endpoints


| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/user/:id` | Get user by ID | - | `{ user: User }` |
| GET | `/user/email/:email` | Get user by email | - | `{ user: User }` |
| POST | `/user` | Create user | `{ email }` | `{ user: User }` |
| PUT | `/user/email/:email` | Update user favorites | `{ favourite_chatbot: [Chatbot] }` | `{ user: User }` |
| DELETE | `/user/email/:email` | Delete user | - | `{ message }` |


#### Chatbot Endpoints


| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/chatbot` | Get all chatbots | - | `{ chatbots: [Chatbot] }` |
| GET | `/chatbot/:id` | Get chatbot by ID | - | `{ chatbot: Chatbot }` |
| POST | `/chatbot` | Create chatbot | `Chatbot` | `{ chatbot: Chatbot }` |
| PUT | `/chatbot/:id` | Update chatbot | `Chatbot` | `{ chatbot: Chatbot }` |


#### Conversation Endpoints


| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/conversation/email/:email` | Get user conversations | - | `{ conversations: [Conversation] }` |
| POST | `/conversation` | Create conversation | `{ userEmail, chatbotId, firstMessage, chatbotName }` | `{ conversation: Conversation }` |
| PUT | `/conversation/:id` | Update conversation | `{ lastMessage }` | `{ conversation: Conversation }` |
| DELETE | `/conversation/:id` | Delete conversation | - | `{ message }` |


#### Message Endpoints


| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/message/conversation/:conversationId` | Get conversation messages | - | `[Message]` |
| GET | `/message/:id` | Get message by ID | - | `Message` |
| POST | `/message` | Create message | `{ conversationId, fromSelf, content }` | `Message` |
| DELETE | `/message/:id` | Delete message | - | `{ message }` |
| DELETE | `/message/conversation/:conversationId` | Delete all messages | - | `{ message }` |


#### AI Endpoints


| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/openai` | Get GPT-4o response | `{ messages: [{ content, fromSelf }] }` | `{ response: { choices: [...] } }` |
| POST | `/custom` | Execute custom plugin | `{ message, schema }` | `{ response: string }` |


---


### Web Backend API


**Base URL**: `https://lumina-web-be-deh3gwc0fre2hjgz.southeastasia-01.azurewebsites.net`


#### User Endpoints


| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/user` | Get all users | - | `{ users: [User] }` |
| GET | `/user/email/:email` | Get user by email | - | `{ user: User }` |
| POST | `/user` | Create user | `{ name, email, domain }` | `{ user: User }` |
| PUT | `/user/:id` | Update user | `{ name, email, domain }` | `{ user: User }` |


#### Plugin Endpoints


| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/plugin` | Get all plugins | - | `{ plugin: [Plugin] }` |
| GET | `/plugin/email/:email` | Get user's plugins | - | `{ plugin: [Plugin] }` |
| GET | `/plugin/:id` | Get plugin by ID | - | `{ plugin: Plugin }` |
| POST | `/plugin` | Create plugin | `Plugin + image (base64)` | `{ plugin: Plugin }` |
| PUT | `/plugin/:id` | Update plugin | `Plugin` | `{ plugin: Plugin }` |
| DELETE | `/plugin/:id` | Delete plugin | - | `{ message }` |


---


## 👥 User Workflows


### Student Workflow


```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT USER JOURNEY                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ONBOARDING                                               │
│     ├─ Download Lumina app (iOS/Android)                     │
│     ├─ Open app → Login screen                               │
│     ├─ Sign in with NTU Microsoft account                    │
│     └─ Account created automatically                         │
│                                                              │
│  2. DISCOVER CHATBOTS                                        │
│     ├─ View home screen                                      │
│     ├─ Browse "Discover Chatbots" section                    │
│     ├─ Click on chatbot to view details                      │
│     ├─ Read description, category, version                   │
│     └─ Add to favorites (optional)                           │
│                                                              │
│  3. START CONVERSATION                                       │
│     ├─ Click "Start Conversation" button                     │
│     ├─ Type first message                                    │
│     ├─ AI responds (GPT-4o or custom plugin)                 │
│     ├─ Continue conversation                                 │
│     └─ Conversation auto-saved                               │
│                                                              │
│  4. MANAGE FAVORITES                                         │
│     ├─ Add frequently used chatbots to favorites             │
│     ├─ Access favorites from home screen                     │
│     ├─ Quick start conversations                             │
│     └─ Remove from favorites anytime                         │
│                                                              │
│  5. VIEW HISTORY                                             │
│     ├─ Navigate to "History" tab                             │
│     ├─ View all past conversations                           │
│     ├─ Click to resume conversation                          │
│     ├─ Swipe to delete conversation                          │
│     └─ Create new conversation                               │
│                                                              │
│  6. DAILY USAGE                                              │
│     ├─ Use Lumina GPT-4o for general queries                 │
│     ├─ Use specialized chatbots for specific tasks           │
│     ├─ Switch between chatbots as needed                     │
│     └─ Review conversation history                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```


### Developer Workflow


```
┌─────────────────────────────────────────────────────────────┐
│                   DEVELOPER USER JOURNEY                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ONBOARDING                                               │
│     ├─ Access Lumina Web Portal                              │
│     ├─ Sign in with NTU Microsoft account                    │
│     ├─ Account created with "Developer" role                 │
│     └─ Redirected to plugin management                       │
│                                                              │
│  2. CREATE PLUGIN                                            │
│     ├─ Click "Create Plugin"                                 │
│     ├─ Step 1: Read instructions                             │
│     ├─ Step 2: Enter plugin details                          │
│     │   ├─ Name (e.g., "Career Advisor")                     │
│     │   ├─ Description                                       │
│     │   ├─ Category (e.g., "Planning")                       │
│     │   └─ Upload image                                      │
│     ├─ Step 3: Configure endpoint                            │
│     │   ├─ Endpoint URL (your LLM backend)                   │
│     │   ├─ Path (e.g., "/getResponse")                       │
│     │   ├─ Request format (JSON/text)                        │
│     │   └─ Request body key                                  │
│     ├─ Step 4: Test endpoint                                 │
│     │   ├─ Send test message                                 │
│     │   ├─ Verify response                                   │
│     │   └─ Debug if needed                                   │
│     ├─ Step 5: Review and submit                             │
│     │   ├─ Check all details                                 │
│     │   ├─ View generated OpenAPI schema                     │
│     │   └─ Submit plugin                                     │
│     └─ Plugin created and activated                          │
│                                                              │
│  3. MANAGE PLUGINS                                           │
│     ├─ View all created plugins                              │
│     ├─ Click plugin to view details                          │
│     ├─ Edit configuration                                    │
│     ├─ Test endpoint                                         │
│     ├─ Activate/deactivate                                   │
│     └─ Delete if needed                                      │
│                                                              │
│  4. MONITOR USAGE                                            │
│     ├─ Check plugin status                                   │
│     ├─ Verify endpoint is working                            │
│     ├─ Update as needed                                      │
│     └─ Maintain plugin quality                               │
│                                                              │
│  5. ITERATE                                                  │
│     ├─ Gather student feedback                               │
│     ├─ Improve LLM backend                                   │
│     ├─ Update plugin configuration                           │
│     ├─ Test changes                                          │
│     └─ Deploy updates                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```


---


## 💻 Development Guide


### Prerequisites


- **Node.js**: v16+ (v18 recommended)
- **npm**: v8+
- **Expo CLI**: `npm install -g expo-cli`
- **Azure Account**: For deployment
- **MongoDB**: Local or Azure Cosmos DB
- **Azure AD**: App registrations configured


### Local Development Setup


#### 1. Clone Repository
```bash
git clone https://github.com/yanxchi/Lumina.git
cd Lumina
```


#### 2. Mobile Frontend Setup
```bash
cd Lumina-Mobile-FE
npm install


# Update config/authConfig.js with your Azure AD details
# Update baseURL to point to local backend (optional)


npx expo start
# Scan QR code with Expo Go app
```


#### 3. Mobile Backend Setup
```bash
cd Lumina-Mobile-BE
npm install


# Create .env file
echo "PORT=3002" > .env
echo "MONGODB_URI=<your-mongodb-uri>" >> .env
echo "AZURE_OPENAI_API_BASE=<your-openai-endpoint>" >> .env
echo "AZURE_OPENAI_APIVERSION=<api-version>" >> .env
echo "AZURE_OPENAI_APIKEY=<your-api-key>" >> .env


npm start
# Server runs on http://localhost:3002
```


#### 4. Web Frontend Setup
```bash
cd lumina-web-fe
npm install


# Update src/config.js with your Azure AD details
# Update redirectUri to http://localhost:3000 for local dev


npm start
# Opens http://localhost:3000
```


#### 5. Web Backend Setup
```bash
cd lumina-web-be
npm install


# Create .env file
echo "PORT=8080" > .env
echo "MONGODB_URI=<your-mongodb-uri>" >> .env


npm start
# Server runs on http://localhost:8080
```


### Project Structure


```
Lumina/
├── Lumina-Mobile-FE/          # Mobile app (React Native)
│   ├── app/                   # Screens (file-based routing)
│   ├── components/            # Reusable components
│   ├── config/                # Configuration files
│   ├── context/               # React Context providers
│   └── assets/                # Images, fonts
│
├── Lumina-Mobile-BE/          # Mobile backend (Node.js)
│   ├── controllers/           # Business logic
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── config/                # Configuration
│   └── index.js               # Entry point
│
├── lumina-web-fe/             # Web portal (React)
│   ├── src/
│   │   ├── screens/           # Page components
│   │   ├── components/        # Reusable components
│   │   ├── config/            # Configuration
│   │   ├── context/           # React Context
│   │   ├── helpers/           # Utility functions
│   │   └── App.js             # Main app component
│   └── public/                # Static assets
│
├── lumina-web-be/             # Web backend (Node.js)
│   ├── controllers/           # Business logic
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── config/                # Configuration
│   └── index.js               # Entry point
│
└── README.md                  # Project overview
```


### Key Technologies


| Component | Technologies |
|-----------|-------------|
| Mobile Frontend | React Native, Expo, TailwindCSS, Axios, expo-auth-session |
| Mobile Backend | Node.js, Express, MongoDB, Mongoose, Azure OpenAI, swagger-client |
| Web Frontend | React, Material-UI, React Router, MSAL, Axios |
| Web Backend | Node.js, Express, MongoDB, Mongoose, Azure Blob Storage |
| Database | MongoDB (Azure Cosmos DB) |
| Authentication | Azure AD (OAuth 2.0 / OpenID Connect) |
| AI | Azure OpenAI (GPT-4o-mini) |
| Deployment | Azure App Services, Azure Static Web Apps |


### Common Development Tasks


#### Add New API Endpoint (Backend)
```bash
# 1. Create controller function
# controllers/example.controller.js
const exampleFunction = async (req, res) => {
 // Logic here
};


# 2. Create route
# routes/example.route.js
router.get("/example", exampleFunction);


# 3. Register route in index.js
app.use("/example", require("./routes/example.route"));
```


#### Add New Screen (Mobile App)
```bash
# Create file in app/ directory
# app/example.jsx
export default function Example() {
 return <View><Text>Example</Text></View>;
}


# Navigate to screen
router.push("/example");
```


#### Add New Screen (Web Portal)
```bash
# 1. Create component
# src/screens/example/Example.jsx


# 2. Add route in App.js
<Route path="/example" element={<Example />} />


# 3. Add to sidebar (optional)
# src/screens/global/Sidebar.jsx
```


### Testing


#### Test Mobile App
```bash
# Run on iOS simulator
npx expo start --ios


# Run on Android emulator
npx expo start --android


# Run on physical device
npx expo start
# Scan QR code with Expo Go
```


#### Test Web Portal
```bash
cd lumina-web-fe
npm start
# Open http://localhost:3000
```


#### Test API Endpoints
```bash
# Using curl
curl http://localhost:3002/chatbot


# Using Postman
# Import endpoints and test
```


### Troubleshooting


#### Mobile App Won't Connect to Backend
```bash
# 1. Check backend is running
# 2. Update baseURL in config/axiosConfig.js to your local IP
# 3. Ensure phone and computer on same network
# 4. Use ngrok for external access (optional)
```


#### Azure AD Login Fails
```bash
# 1. Verify clientId and tenantId in config
# 2. Check redirect URI in Azure Portal
# 3. Ensure app registration has correct permissions
# 4. Clear browser cache / app data
```


#### Plugin Not Appearing in Mobile App
```bash
# 1. Check plugin.activated = true
# 2. Verify mobile backend can access web backend database
# 3. Refresh mobile app
# 4. Check chatbot API endpoint
```


---


## 🎓 Summary


### How Lumina Works


1. **Developers** create custom AI chatbot plugins via the **Web Portal**
2. Plugins are stored in **MongoDB** with OpenAPI schemas
3. **Students** access plugins as chatbots in the **Mobile App**
4. When students chat, the **Mobile Backend** either:
  - Calls **Azure OpenAI** for general queries (GPT-4o-mini)
  - Executes **custom plugin** by calling external API
5. Conversations are saved and can be reviewed in history
6. Students can favorite chatbots for quick access


### Key Innovations


- **Plugin Architecture**: Developers can integrate any LLM backend via OpenAPI
- **Dual Interface**: Separate apps for students (mobile) and developers (web)
- **Centralized Management**: All plugins managed from one portal
- **Seamless Integration**: Plugins appear as native chatbots in mobile app
- **Azure Integration**: Leverages Azure AD, OpenAI, Blob Storage, App Services


### Future Enhancements


- Analytics dashboard for developers
- Rating system for plugins
- Plugin marketplace
- Multi-language support
- Voice input/output
- Image generation plugins
- Collaborative features
- Advanced plugin testing tools


---


**Last Updated**: 2025-11-18
**Version**: 1.0
**Maintained By**: Lumina Development Team







