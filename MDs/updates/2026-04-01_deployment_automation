# Deployment Automation Implementation


**Date:** 04 January 2026


---


## Summary


Implemented **Managed Deployment** feature for Lumina, allowing plugin developers to upload Azure Function zip files directly through the web portal. The system automatically deploys the code to Azure Functions and generates the endpoint URL.


This implementation follows the plan outlined in `2026-01-01_integration_plan.md`.


---


## What's New


Developers now have **two deployment options** when creating a plugin:


| Mode | Description | User Action |
|------|-------------|-------------|
| **External** (default) | Developer hosts their own backend | Enter endpoint URL manually |
| **Managed** (NEW) | Lumina deploys to Azure | Upload zip file → auto-deploy |


---


## Files Created


### Backend (lumina-web-be)


| File | Purpose | Lines |
|------|---------|-------|
| `services/deploymentService.js` | Core Azure deployment logic - validates zips, deploys to Azure Functions, manages lifecycle | ~280 |
| `controllers/deploy.controller.js` | HTTP handlers for deployment endpoints | ~250 |
| `routes/deploy.route.js` | Route definitions with multer middleware for file uploads | ~90 |


### Frontend (lumina-web-fe)


| File | Purpose | Lines |
|------|---------|-------|
| `src/components/create/DeploymentModeSelector.jsx` | Toggle between deployment modes + drag-drop zip upload + validation UI | ~220 |


---


## Files Modified


### Backend (lumina-web-be)


| File | Changes |
|------|---------|
| `models/plugin.model.js` | Added `deploymentType` (enum: 'external'/'managed') and `functionAppName` fields. Made `endpoint` optional for managed deployments. |
| `index.js` | Registered `/api/deploy` routes |


### Frontend (lumina-web-fe)


| File | Changes |
|------|---------|
| `src/screens/developer/create/Create.jsx` | Added deployment state variables, integrated DeploymentModeSelector, modified handleSubmit for managed deployment, updated handleNext for yaml generation, added deployment progress indicator |
| `src/components/create/ReviewForm.jsx` | Added deployment mode display with Chip components showing "Managed Deployment" or "External Endpoint" |


---


## API Endpoints


### POST `/api/deploy/validate`


Validates zip file structure without deploying.


**Request:** `multipart/form-data` with `file` field


**Response:**
```json
{
 "success": true,
 "errors": [],
 "warnings": ["__pycache__ directories found - consider excluding"],
 "fileCount": 5
}
```


### POST `/api/deploy/:pluginId`


Deploys zip to Azure Functions.


**Request:** `multipart/form-data` with `file` and `userEmail` fields


**Response:**
```json
{
 "success": true,
 "functionAppName": "lumina-a1b2c3d4-5678efgh",
 "functionUrl": "https://lumina-a1b2c3d4-5678efgh.azurewebsites.net",
 "warnings": []
}
```


### GET `/api/deploy/:pluginId/status`


Gets deployment status for a plugin.


### DELETE `/api/deploy/:pluginId?userEmail=...`


Deletes deployed function app and resets plugin to external mode.


---


## How It Works


### Managed Deployment Flow


```
1. Developer selects "Managed Deployment" mode
2. Drags/drops zip file → Frontend calls POST /api/deploy/validate
3. Backend validates structure:
  - Required: function_app.py, requirements.txt, host.json
  - Warns: local.settings.json, __pycache__
4. Developer proceeds through wizard (test step shows preview)
5. On Submit:
  a. Plugin created in MongoDB with deploymentType: "managed"
  b. POST /api/deploy/:pluginId with zip file
  c. Backend:
     - Creates Azure Function App (Consumption plan, Python 3.11)
     - Deploys via Kudu zip deploy API
     - Updates plugin.endpoint with generated URL
6. Success screen shown
```


### Azure Resources Created


For each managed deployment:


| Resource | Naming Pattern | SKU |
|----------|---------------|-----|
| Function App | `lumina-{pluginId-last8}-{uuid8}` | Consumption (Y1) |
| App Service Plan | `lumina-consumption-plan` (shared) | Dynamic/Linux |


---


## Required Setup


### 1. Install Backend Dependencies


```bash
cd Lumina/lumina-web-be
npm install @azure/identity @azure/arm-appservice @azure/arm-storage adm-zip multer uuid
```


### 2. Configure Environment Variables


Add to `lumina-web-be/.env`:


```bash
# Azure Service Principal (required)
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_SUBSCRIPTION_ID=your-subscription-id


# Azure Resources (required)
AZURE_RESOURCE_GROUP=lumina-deployments-rg
AZURE_STORAGE_ACCOUNT=luminadeploymentstorage


# Optional
AZURE_APP_INSIGHTS_KEY=your-app-insights-key
AZURE_LOCATION=southeastasia
```


### 3. Azure Service Principal Permissions


The service principal needs these roles on the resource group:
- **Contributor** - Create/manage Function Apps
- **Storage Account Contributor** - Access storage for Functions


### 4. Create Azure Resource Group (if needed)


```bash
az group create --name lumina-deployments-rg --location southeastasia
az storage account create --name luminadeploymentstorage --resource-group lumina-deployments-rg --sku Standard_LRS
```


---


## Zip File Requirements


Developers uploading for managed deployment must include:


| File | Required | Purpose |
|------|----------|---------|
| `function_app.py` | ✅ | Main Azure Function entry point |
| `requirements.txt` | ✅ | Python dependencies |
| `host.json` | ✅ | Azure Functions host configuration |
| `local.settings.json` | ❌ | Ignored - local dev only |


### Example function_app.py


```python
import azure.functions as func
import logging


app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="http_trigger")
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
   query = req.params.get('query') or req.get_json().get('query', '')
   # Your chatbot logic here
   response = f"You asked: {query}"
   return func.HttpResponse(response, mimetype="application/json")
```


---


## Backward Compatibility


All changes maintain backward compatibility:


| Feature | Behavior for Existing Plugins |
|---------|------------------------------|
| `deploymentType` | Defaults to `'external'` |
| `functionAppName` | `undefined` (not applicable) |
| `endpoint` required | Now optional (existing plugins have it) |
| UI flow | External mode selected by default |


---


## Error Handling


| Scenario | User Experience |
|----------|----------------|
| Invalid zip structure | Red alert with specific missing files |
| File too large (>50MB) | "File too large" error message |
| Azure deployment fails | Plugin saved, can retry deployment later |
| Authorization failure | "Not authorized" 403 error |


---


## Code Architecture


```
lumina-web-be/
├── services/
│   └── deploymentService.js    # Core logic (validate, deploy, delete)
├── controllers/
│   └── deploy.controller.js    # HTTP handlers
├── routes/
│   └── deploy.route.js         # Multer + routing
└── models/
   └── plugin.model.js         # +deploymentType, +functionAppName


lumina-web-fe/
├── components/create/
│   ├── DeploymentModeSelector.jsx  # NEW - mode toggle + upload
│   └── ReviewForm.jsx              # MOD - deployment status display
└── screens/developer/create/
   └── Create.jsx                  # MOD - integrated deployment flow
```


---


## Key Implementation Details


### Authentication


Since Lumina doesn't use traditional auth middleware, authorization uses `userEmail`:
- Frontend sends `userEmail` in form data
- Backend validates `plugin.userEmail === request.userEmail`


### Zip Validation


Uses `adm-zip` library to:
1. Parse zip in memory (no disk writes)
2. Check for required files
3. Warn about unnecessary files
4. Return validation result before deployment


### Azure Deployment


Uses Azure SDK for JavaScript:
- `@azure/identity` - ClientSecretCredential
- `@azure/arm-appservice` - Function App creation
- `@azure/arm-storage` - Storage connection string
- Kudu API - Zip deployment via HTTP


---


## Testing Checklist


- [ ] External deployment flow unchanged
- [ ] Managed deployment: zip upload + validation
- [ ] Managed deployment: successful Azure deployment
- [ ] Managed deployment: error handling (invalid zip)
- [ ] Review form shows correct deployment mode
- [ ] Deployment progress indicator during submission
- [ ] Delete deployment functionality


---


## Future Enhancements


| Feature | Priority | Description |
|---------|----------|-------------|
| Deployment status polling | Medium | Real-time deployment progress |
| Redeploy capability | Medium | Update existing deployment |
| Deployment logs | Low | View Azure Function logs |
| Rollback | Low | Revert to previous version |
| Custom domain | Low | Custom endpoint URLs |


---


## Related Documentation


- `2026-01-01_integration_plan.md` - Original integration plan
- `2026-02-01_integration_srs.md` - Software requirements specification







