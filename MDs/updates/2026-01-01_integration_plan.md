# Lumina Deployment Automation Enhancement


## Executive Summary


This document outlines a **simplified enhancement** to the **Lumina Platform** that adds automated Azure Function deployment capabilities. Rather than a full platform integration, this approach **extracts only the deployment automation logic** from the Chatbot Middleware and integrates it directly into Lumina's existing architecture.


### Key Benefits


| Benefit | Current State | Enhanced State |
|---------|--------------|----------------|
| **Backend Deployment** | Manual - developers must deploy their own backends | Automated - zip upload → Azure Function |
| **Time to Deploy** | Hours to days | Minutes |
| **Technical Barrier** | High - requires Azure expertise | Low - drag & drop |
| **Codebase Changes** | N/A | Minimal - extends existing wizard |


### What's NOT Included (Simplification)
- ❌ Telegram support (not needed for Lumina use case)
- ❌ Custom deployment mode (use developer's Azure) - Phase 2
- ❌ Terraform deployment mode - Phase 2
- ❌ Full middleware platform merge
- ❌ Database migration (Cosmos SQL → MongoDB)


### Focus: Managed Deployment Only
Developers upload a zip file → Lumina deploys to **Lumina's Azure resources** → Developer gets working endpoint


---


## Table of Contents


1. [Current Lumina Architecture](#current-lumina-architecture)
2. [Simplified Enhancement Approach](#simplified-enhancement-approach)
3. [Technical Implementation Plan](#technical-implementation-plan)
4. [File-by-File Changes](#file-by-file-changes)
5. [API Design](#api-design)
6. [Schema Changes](#schema-changes)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Backward Compatibility](#backward-compatibility)
9. [Testing Strategy](#testing-strategy)


---


## Current Lumina Architecture


### Plugin Creation Wizard (5 Steps)


```
Current Flow:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Step 1    │───▶│    Step 2    │───▶│    Step 3    │───▶│    Step 4    │───▶│    Step 5    │
│ Instructions │    │Plugin Details│    │Enter Endpoint│    │Test Endpoint │    │Review/Submit │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                   • Name                • Server URL        • Chat interface   • Summary
                   • Category            • Path              • Live test         • Confirmation
                   • Description         • Request format    • Validation        • Submit to DB
                   • Image               • Auth type
```


**Current Limitation:** Step 3 requires developers to provide an **existing endpoint URL**. Developers must deploy their own backend before using Lumina.


### Existing Components


| Component | File | Purpose |
|-----------|------|---------|
| Create.jsx | `lumina-web-fe/src/screens/developer/create/Create.jsx` | Main wizard orchestrator |
| PluginDetailsForm.jsx | `lumina-web-fe/src/components/create/PluginDetailsForm.jsx` | Name, category, description |
| PluginEndpointForm.jsx | `lumina-web-fe/src/components/create/PluginEndpointForm.jsx` | Endpoint configuration |
| TestEndpoint.jsx | `lumina-web-fe/src/components/create/TestEndpoint.jsx` | Live endpoint testing |
| ReviewForm.jsx | `lumina-web-fe/src/components/create/ReviewForm.jsx` | Final review |
| plugin.controller.js | `lumina-web-be/controllers/plugin.controller.js` | Plugin CRUD operations |
| plugin.model.js | `lumina-web-be/models/plugin.model.js` | MongoDB schema |


---


## Simplified Enhancement Approach


### New Flow: Deploy OR Connect


```
Enhanced Flow (6 Steps):
┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────────────────────────────┐
│    Step 1    │───▶│    Step 2    │───▶│                     Step 3 (NEW)                     │
│ Instructions │    │Plugin Details│    │              Choose Deployment Mode                  │
└──────────────┘    └──────────────┘    └──────────────────────────────────────────────────────┘
                                                           │
                         ┌─────────────────────────────────┴─────────────────────────────────┐
                         │                                                                   │
                         ▼                                                                   ▼
              ┌─────────────────────┐                                             ┌─────────────────────┐
              │  "Deploy my code"   │                                             │ "I have an endpoint"│
              │   (NEW OPTION)      │                                             │   (EXISTING)        │
              └─────────────────────┘                                             └─────────────────────┘
                         │                                                                   │
                         ▼                                                                   ▼
              ┌─────────────────────┐                                             ┌─────────────────────┐
              │  Step 3a: Upload    │                                             │  Step 3b: Enter     │
              │  Zip File           │                                             │  Endpoint URL       │
              │  • Drag & drop      │                                             │  (Current behavior) │
              │  • Validation       │                                             └─────────────────────┘
              │  • Deploy button    │                                                        │
              └─────────────────────┘                                                        │
                         │                                                                   │
                         │ Auto-generates:                                                   │
                         │ • endpoint URL                                                    │
                         │ • path = /api/chat/query                                          │
                         │ • requestBodyQueryKey = "query"                                   │
                         │                                                                   │
                         └───────────────────────────────┬───────────────────────────────────┘
                                                         │
                                                         ▼
                                              ┌─────────────────────┐
                                              │    Step 4: Test     │
                                              │    (Existing)       │
                                              └─────────────────────┘
                                                         │
                                                         ▼
                                              ┌─────────────────────┐
                                              │  Step 5: Review     │
                                              │    (Existing)       │
                                              └─────────────────────┘
```


### Key Insight: Avoid Schema Reconciliation


By generating the OpenAPI YAML automatically for deployed chatbots with a **fixed interface**, we avoid complex schema changes:


```yaml
# Auto-generated OpenAPI for deployed chatbots
openapi: "3.0.0"
info:
 title: "{plugin_name} API"
 version: "1.0.0"
servers:
 - url: "https://{function_app_name}.azurewebsites.net"
paths:
 /api/chat/query:
   post:
     operationId: "getResponse"
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             properties:
               query:
                 type: string
             required:
               - query
     responses:
       "200":
         description: "Success"
         content:
           application/json:
             schema:
               type: string
```


This matches Lumina's existing `generateYaml()` function pattern exactly.


---


## Technical Implementation Plan
### Architecture: Enhanced Lumina


```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ENHANCED LUMINA PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    ENHANCED DEVELOPER PORTAL                             │    │
│  │                    (lumina-web-fe - MODIFIED)                            │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │  Create.jsx (Modified)                                                   │    │
│  │  ├── Step 1: Instructions                                               │    │
│  │  ├── Step 2: Plugin Details                                             │    │
│  │  ├── Step 3: Deployment Mode (NEW)  ──┬── "Deploy my code" (NEW)        │    │
│  │  │                                    └── "I have an endpoint" (existing)│    │
│  │  ├── Step 4: Test Endpoint                                              │    │
│  │  └── Step 5: Review & Submit                                            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                          │
│                                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    BACKEND SERVICES                                      │    │
│  │                    (lumina-web-be - MODIFIED)                            │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │  NEW: services/deploymentService.js                                     │    │
│  │  ├── validateZip()       - Port from azureFunctionDeployerClient.py     │    │
│  │  ├── deployToAzure()     - Port from azureFunctionDeployerClient.py     │    │
│  │  └── generateOpenApiYaml() - Auto-generate for deployed functions       │    │
│  │                                                                          │    │
│  │  MODIFIED: controllers/plugin.controller.js                              │    │
│  │  └── createPlugin() - Handle deploymentType field                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                          │
│                                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Azure Cosmos DB (MongoDB API) - SAME DATABASE                          │    │
│  │  └── plugins collection (SCHEMA EXTENDED with 2 new optional fields)    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```


---


## File-by-File Changes


### Frontend Changes (lumina-web-fe)


#### 1. NEW: `src/components/create/DeploymentModeSelector.jsx`


New component for Step 3 - allows developer to choose between deploying code or providing endpoint.


```jsx
// Key features:
// - Radio button group: "Deploy my code" vs "I have an endpoint"
// - If "Deploy my code":
//   - Show drag & drop zone for zip file
//   - Validate on upload (call /deploy/validate)
//   - Show validation status (loading, success, error)
//   - Deploy button (call /deploy/execute)
// - If "I have an endpoint":
//   - Render existing PluginEndpointForm
```


#### 2. MODIFY: `src/screens/developer/create/Create.jsx`


```jsx
// Changes needed:
// 1. Add new state: deploymentMode ('deploy' | 'endpoint')
// 2. Add new state: zipFile, validationStatus, deploymentStatus
// 3. Insert DeploymentModeSelector between Step 2 and current Step 3
// 4. If deploymentMode === 'deploy' && deployment successful:
//    - Auto-set endpoint, path, requestBodyQueryKey
//    - Skip to test step
// 5. Update steps array: ["Instructions", "Plugin Details", "Deployment Mode", "Test", "Review"]
```


#### 3. MODIFY: `src/components/create/ReviewForm.jsx`


```jsx
// Add display for:
// - deploymentMode indicator
// - If deployed: show "Deployed to Azure" badge
// - Show function app name if deployed
```


### Backend Changes (lumina-web-be)


#### 4. NEW: `services/deploymentService.js`


Port the core deployment logic from Python to Node.js:


```javascript
// Core functions to port from azureFunctionDeployerClient.py:


const { DefaultAzureCredential } = require("@azure/identity");
const { WebSiteManagementClient } = require("@azure/arm-appservice");
const { StorageManagementClient } = require("@azure/arm-storage");
const AdmZip = require("adm-zip");
const acorn = require("acorn");  // For Python AST-like validation, or use python-shell


class DeploymentService {
 // Validate zip file structure
 async validateZip(zipBuffer) {
   // 1. Extract zip to memory
   // 2. Check for required files: chatbot.py, requirements.txt
   // 3. Parse chatbot.py and validate async main(query: str) -> str
   // 4. Return { valid: boolean, errors: string[] }
 }


 // Deploy to Azure Function
 async deploy(zipBuffer, pluginName, userEmail) {
   // 1. Create Azure Function App (consumption plan)
   // 2. Generate unique function app name
   // 3. Deploy via Kudu zip deploy
   // 4. Return { endpoint: string, functionAppName: string }
 }


 // Generate OpenAPI YAML
 generateOpenApiYaml(pluginName, endpoint) {
   // Return fixed YAML with /api/chat/query path
 }
}
```


#### 5. NEW: `routes/deploy.route.js`


```javascript
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


// POST /deploy/validate - Validate zip without deploying
router.post("/validate", upload.single("file"), validateZipHandler);


// POST /deploy/execute - Deploy zip to Azure
router.post("/execute", upload.single("file"), deployHandler);


// GET /deploy/status/:functionAppName - Check deployment status
router.get("/status/:functionAppName", statusHandler);


module.exports = router;
```


#### 6. MODIFY: `index.js`


```javascript
// Add route:
app.use("/deploy", require("./routes/deploy.route"));
```


#### 7. MODIFY: `models/plugin.model.js`


```javascript
// Add new optional fields:
deploymentType: {
 type: String,
 enum: ['external', 'managed'],
 default: 'external',
 required: false
},
functionAppName: {
 type: String,
 required: false  // Only for managed deployments
}
```


---


## API Design


### POST /deploy/validate


Validates a zip file without deploying.


**Request:**
```
Content-Type: multipart/form-data
file: chatbot.zip
```


**Response (Success):**
```json
{
 "valid": true,
 "files": ["chatbot.py", "requirements.txt"],
 "mainFunctionFound": true
}
```


**Response (Error):**
```json
{
 "valid": false,
 "errors": [
   "Missing required file: requirements.txt",
   "main() function must accept exactly one string parameter"
 ]
}
```


### POST /deploy/execute


Validates and deploys a zip file to Azure.


**Request:**
```
Content-Type: multipart/form-data
file: chatbot.zip
pluginName: "My Chatbot"
userEmail: "user@e.ntu.edu.sg"
```


**Response (Success):**
```json
{
 "success": true,
 "endpoint": "https://my-chatbot-a1b2c3d4.azurewebsites.net",
 "functionAppName": "my-chatbot-a1b2c3d4",
 "path": "/api/chat/query",
 "openApiYaml": "openapi: 3.0.0\ninfo:..."
}
```


**Response (Error):**
```json
{
 "success": false,
 "error": "Deployment failed: Kudu deployment timeout"
}
```


---


## Schema Changes


### Current Plugin Schema (plugin.model.js)


```javascript
const PluginSchema = mongoose.Schema({
 userEmail: { type: String, required: true },
 userName: { type: String, required: true },
 name: { type: String, required: true },
 version: { type: String, required: true },
 image: { type: String, required: false },
 category: { type: String, required: true },
 description: { type: String, required: true },
 activated: { type: Boolean, required: true },
 schema: { type: String, required: true },        // OpenAPI YAML
 endpoint: { type: String, required: true },
 path: { type: String, required: true },
 requestBodyQueryKey: { type: String, required: false },
 requestFormat: { type: String, required: false },
 requestContentType: { type: String, required: false },
 authType: { type: String, required: false },
 apiKey: { type: String, required: false }
}, { timestamps: true });
```


### Enhanced Plugin Schema (2 new fields)


```javascript
const PluginSchema = mongoose.Schema({
 // ... all existing fields unchanged ...


 // NEW: Deployment tracking (optional - backward compatible)
 deploymentType: {
   type: String,
   enum: ['external', 'managed'],
   default: 'external'
 },
 functionAppName: {
   type: String,
   required: false  // Only populated for managed deployments
 }
}, { timestamps: true });
```


**Why This Works:**
- All new fields are **optional** with defaults
- Existing plugins automatically get `deploymentType: 'external'`
- No migration needed - Mongoose handles missing fields gracefully
- Timer sync function doesn't need changes (new fields are ignored by mobile)


---


## Implementation Roadmap


### Simplified 4-Week Plan (Managed Deployment Only)


This focused approach delivers the core value (zip → endpoint) in 4 weeks.


### Phase 1: Backend Foundation (Week 1)


| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | Create `services/deploymentService.js` | Port zip validation from Python |
| 3-4 | Create `routes/deploy.route.js` | POST /deploy/validate, /deploy/execute |
| 5 | Update `models/plugin.model.js` | Add deploymentType, functionAppName fields |


**Key Implementation: deploymentService.js**


```javascript
// Port these functions from azureFunctionDeployerClient.py:
// 1. _destrucuture_zip_folder() → extractZip()
// 2. _validate_zip_folder() → validateZip()
// 3. _create_required_azure_files() → addAzureFunctionFiles()
// 4. _deploy_function_app() → deployToAzure()


// Use these Node.js libraries:
// - adm-zip: Extract and create zip files
// - @azure/arm-appservice: WebSiteManagementClient
// - @azure/arm-storage: StorageManagementClient
// - @azure/identity: DefaultAzureCredential
```


### Phase 2: Frontend Integration (Week 2)


| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | Create `DeploymentModeSelector.jsx` | Radio buttons + zip dropzone |
| 3-4 | Modify `Create.jsx` | Insert new step, handle state |
| 5 | Modify `ReviewForm.jsx` | Show deployment status |


**UI Mockup:**


```
┌─────────────────────────────────────────────────────────────────┐
│  Choose how to add your plugin endpoint                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ○ Deploy my code                                              │
│    Upload a zip file and we'll deploy it for you               │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │                                                         │ │
│    │   📁 Drag & drop your chatbot.zip here                 │ │
│    │         or click to browse                              │ │
│    │                                                         │ │
│    └─────────────────────────────────────────────────────────┘ │
│    Requirements:                                               │
│    • chatbot.py with async main(query: str) -> str            │
│    • requirements.txt                                          │
│                                                                 │
│  ○ I have my own endpoint                                     │
│    I've already deployed my chatbot and have a URL            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```


### Phase 3: Integration & Testing (Week 3)


| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | End-to-end testing | Validate full flow works |
| 3 | Error handling | User-friendly error messages |
| 4 | Update timer sync function | Add new fields (optional) |
| 5 | Mobile app testing | Verify deployed plugins work |


### Phase 4: Polish & Documentation (Week 4)


| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | Sample chatbot template | Starter zip file for developers |
| 3 | In-app help text | Tooltips and instructions |
| 4 | Beta testing | Test with 3-5 developers |
| 5 | Bug fixes | Address beta feedback |


---


## Environment Variables Required


Add to `lumina-web-be/.env`:


```bash
# Azure Deployment (Managed Mode)
AZURE_SUBSCRIPTION_ID=your-subscription-id
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_RESOURCE_GROUP=lumina-deployments-rg
AZURE_STORAGE_ACCOUNT=luminadeploymentstorage
AZURE_APP_INSIGHTS_KEY=your-app-insights-key
AZURE_LOCATION=southeastasia
```


---


## Backward Compatibility


All existing plugins continue to work without modification:


- New fields (`deploymentType`, `functionAppName`) are **optional** with defaults
- Existing plugins automatically get `deploymentType: 'external'`
- No database migration required - Mongoose handles missing fields gracefully
- Timer sync function doesn't need changes (new fields are ignored by mobile)


---


## OpenAPI Schema Auto-Generation


For deployed chatbots, we auto-generate the required OpenAPI YAML:


```yaml
openapi: "3.0.0"
info:
 title: "{pluginName}"
 version: "1.0.0"
servers:
 - url: "{endpoint}"
paths:
 /api/chat/query:
   post:
     operationId: "getChatResponse"
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             properties:
               query:
                 type: string
             required:
               - query
     responses:
       "200":
         description: "Successful response"
         content:
           application/json:
             schema:
               type: object
```


This is generated in `deploymentService.js` and stored in the plugin's `schema` field.


---


## Key Code References


### Files to Create


| File | Purpose |
|------|---------|
| `lumina-web-be/services/deploymentService.js` | Port deployment logic from Python |
| `lumina-web-be/routes/deploy.route.js` | New API endpoints |
| `lumina-web-fe/src/components/create/DeploymentModeSelector.jsx` | New UI component |


### Files to Modify


| File | Changes |
|------|---------|
| `lumina-web-be/models/plugin.model.js` | Add 2 optional fields |
| `lumina-web-be/index.js` | Add deploy route |
| `lumina-web-fe/src/screens/developer/create/Create.jsx` | Add deployment step |
| `lumina-web-fe/src/components/create/ReviewForm.jsx` | Show deployment status |


### Reference Files (Port Logic From)


| Source | Target |
|--------|--------|
| `chatbot-middleware/mkiats-dev-deployment/azureFunctionDeployerClient.py` | `deploymentService.js` |


---


## Conclusion


This integration adds **one new capability** to Lumina: developers can upload a zip file and get a deployed endpoint automatically. The implementation:


1. **Adds 2 new files** to backend (service + route)
2. **Adds 1 new component** to frontend
3. **Modifies 4 existing files** (minimal changes)
4. **Adds 2 optional fields** to plugin schema
5. **Requires no database migration**
6. **Maintains full backward compatibility**


**Timeline: 4 weeks** for managed deployment mode only.





