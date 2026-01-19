# Phase 4: Deployment Automation - Setup Instructions


**Date:** 12 January 2026


This guide provides step-by-step instructions for completing and testing the Lumina deployment automation feature on your target system.


---


## Prerequisites


Before starting, ensure you have:
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Azure CLI installed (`az --version`)
- [ ] Azure subscription with Owner or Contributor access
- [ ] MongoDB connection (existing Lumina setup)


---


## Overview of Required Changes


### Current State (Already in Codebase)
| File | Status |
|------|--------|
| `lumina-web-be/package.json` | ✅ Dependencies added |
| `lumina-web-be/models/plugin.model.js` | ✅ New fields added |
| `lumina-web-be/index.js` | ✅ Route registered |


### Files to Create
| File | Purpose |
|------|---------|
| `lumina-web-be/services/deploymentService.js` | Azure deployment logic |
| `lumina-web-be/controllers/deploy.controller.js` | HTTP request handlers |
| `lumina-web-be/routes/deploy.route.js` | Route definitions with multer |
| `lumina-web-fe/src/components/create/DeploymentModeSelector.jsx` | UI component |


### Files to Modify
| File | Changes |
|------|---------|
| `lumina-web-fe/src/screens/developer/create/Create.jsx` | Add deployment state & logic |
| `lumina-web-fe/src/components/create/ReviewForm.jsx` | Show deployment mode |


---


## Step 1: Install Backend Dependencies


```bash
cd Lumina/lumina-web-be
npm install
```


### Verification
```bash
npm ls @azure/identity @azure/arm-appservice adm-zip multer uuid
```


**Expected output:** All packages listed without errors.


---


## Step 2: Set Up Azure Resources


### 2.1 Login to Azure
```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION_NAME"
```


### 2.2 Create Resource Group
```bash
az group create \
 --name lumina-deployments-rg \
 --location southeastasia
```


### 2.3 Create Storage Account
```bash
az storage account create \
 --name luminadeploystorage \
 --resource-group lumina-deployments-rg \
 --location southeastasia \
 --sku Standard_LRS \
 --kind StorageV2
```


**Note:** Storage account name must be globally unique, lowercase, 3-24 chars.


### 2.4 Create Service Principal
```bash
az ad sp create-for-rbac \
 --name "lumina-deployment-sp" \
 --role Contributor \
 --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/lumina-deployments-rg \
 --sdk-auth
```


**Save the output!** You'll need these values:
```json
{
 "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
 "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 ...
}
```


### Verification
```bash
az group show --name lumina-deployments-rg --query "properties.provisioningState"
az storage account show --name luminadeploystorage --query "provisioningState"
```


**Expected:** Both should return `"Succeeded"`.


---


## Step 3: Configure Environment Variables


Add these to `lumina-web-be/.env`:


```bash
# Azure Service Principal (from Step 2.4)
AZURE_TENANT_ID=your-tenant-id-here
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here
AZURE_SUBSCRIPTION_ID=your-subscription-id-here


# Azure Resources (from Steps 2.2-2.3)
AZURE_RESOURCE_GROUP=lumina-deployments-rg
AZURE_STORAGE_ACCOUNT=luminadeploystorage
AZURE_LOCATION=southeastasia
```


### Verification
```bash
cd Lumina/lumina-web-be
node -e "require('dotenv').config(); console.log('TENANT:', process.env.AZURE_TENANT_ID ? 'SET' : 'MISSING')"
```


---


## Step 4: Create Backend Files


### 4.1 Create `services/deploymentService.js`


Create the file at `Lumina/lumina-web-be/services/deploymentService.js`:


```javascript
/**
* Deployment Service - Handles Azure Function App deployment for managed plugins
*/
const { ClientSecretCredential } = require("@azure/identity");
const { WebSiteManagementClient } = require("@azure/arm-appservice");
const { StorageManagementClient } = require("@azure/arm-storage");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");


const REQUIRED_FILES = ["function_app.py", "requirements.txt", "host.json"];
const WARN_FILES = ["local.settings.json", "__pycache__"];


function validateZipStructure(zipBuffer) {
 const result = { valid: true, errors: [], warnings: [], fileCount: 0 };
 try {
   const zip = new AdmZip(zipBuffer);
   const entries = zip.getEntries();
   const fileNames = entries.map((e) => e.entryName);
   result.fileCount = entries.length;


   for (const required of REQUIRED_FILES) {
     const found = fileNames.some((f) => f === required || f.endsWith("/" + required));
     if (!found) { result.errors.push("Missing required file: " + required); result.valid = false; }
   }
   for (const warn of WARN_FILES) {
     if (fileNames.some((f) => f.includes(warn))) {
       result.warnings.push("Found " + warn + " - consider excluding");
     }
   }
   if (entries.length === 0) { result.errors.push("Zip file is empty"); result.valid = false; }
 } catch (error) {
   result.errors.push("Invalid zip file: " + error.message);
   result.valid = false;
 }
 return result;
}


function generateFunctionAppName(pluginId) {
 const shortId = pluginId.slice(-8);
 const uuid = uuidv4().split("-")[0];
 return ("lumina-" + shortId + "-" + uuid).toLowerCase();
}


function getAzureCredential() {
 const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;
 if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
   throw new Error("Azure credentials not configured");
 }
 return new ClientSecretCredential(AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET);
}


async function getStorageConnectionString(credential) {
 const { AZURE_SUBSCRIPTION_ID, AZURE_RESOURCE_GROUP, AZURE_STORAGE_ACCOUNT } = process.env;
 const storageClient = new StorageManagementClient(credential, AZURE_SUBSCRIPTION_ID);
 const keys = await storageClient.storageAccounts.listKeys(AZURE_RESOURCE_GROUP, AZURE_STORAGE_ACCOUNT);
 return "DefaultEndpointsProtocol=https;AccountName=" + AZURE_STORAGE_ACCOUNT +
        ";AccountKey=" + keys.keys[0].value + ";EndpointSuffix=core.windows.net";
}


async function createFunctionApp(functionAppName, storageConnectionString) {
 const credential = getAzureCredential();
 const { AZURE_SUBSCRIPTION_ID, AZURE_RESOURCE_GROUP, AZURE_LOCATION = "southeastasia" } = process.env;
 const webClient = new WebSiteManagementClient(credential, AZURE_SUBSCRIPTION_ID);


 return await webClient.webApps.beginCreateOrUpdateAndWait(AZURE_RESOURCE_GROUP, functionAppName, {
   location: AZURE_LOCATION,
   kind: "functionapp,linux",
   reserved: true,
   siteConfig: {
     linuxFxVersion: "Python|3.11",
     appSettings: [
       { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
       { name: "FUNCTIONS_WORKER_RUNTIME", value: "python" },
       { name: "AzureWebJobsStorage", value: storageConnectionString },
       { name: "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING", value: storageConnectionString },
       { name: "WEBSITE_CONTENTSHARE", value: functionAppName },
       { name: "SCM_DO_BUILD_DURING_DEPLOYMENT", value: "true" },
     ],
   },
   sku: { name: "Y1", tier: "Dynamic" },
 });
}


async function deployToFunctionApp(functionAppName, zipBuffer) {
 const credential = getAzureCredential();
 const { AZURE_SUBSCRIPTION_ID, AZURE_RESOURCE_GROUP } = process.env;
 const webClient = new WebSiteManagementClient(credential, AZURE_SUBSCRIPTION_ID);


 const creds = await webClient.webApps.beginListPublishingCredentialsAndWait(
   AZURE_RESOURCE_GROUP, functionAppName
 );
 const authHeader = "Basic " + Buffer.from(
   creds.publishingUserName + ":" + creds.publishingPassword
 ).toString("base64");


 const response = await fetch(
   "https://" + functionAppName + ".scm.azurewebsites.net/api/zipdeploy",
   {
     method: "POST",
     headers: { Authorization: authHeader, "Content-Type": "application/zip" },
     body: zipBuffer,
   }
 );


 if (!response.ok) {
   throw new Error("Deployment failed: " + response.status);
 }
 return { success: true, functionUrl: "https://" + functionAppName + ".azurewebsites.net" };
}


async function deleteFunctionApp(functionAppName) {
 const credential = getAzureCredential();
 const { AZURE_SUBSCRIPTION_ID, AZURE_RESOURCE_GROUP } = process.env;
 const webClient = new WebSiteManagementClient(credential, AZURE_SUBSCRIPTION_ID);
 await webClient.webApps.delete(AZURE_RESOURCE_GROUP, functionAppName);
}


async function getFunctionAppStatus(functionAppName) {
 const credential = getAzureCredential();
 const { AZURE_SUBSCRIPTION_ID, AZURE_RESOURCE_GROUP } = process.env;
 const webClient = new WebSiteManagementClient(credential, AZURE_SUBSCRIPTION_ID);


 try {
   const app = await webClient.webApps.get(AZURE_RESOURCE_GROUP, functionAppName);
   return { exists: true, state: app.state, url: "https://" + app.defaultHostName };
 } catch (error) {
   if (error.statusCode === 404) return { exists: false };
   throw error;
 }
}


async function deployPlugin(pluginId, zipBuffer) {
 const validation = validateZipStructure(zipBuffer);
 if (!validation.valid) {
   return { success: false, errors: validation.errors, warnings: validation.warnings };
 }


 const functionAppName = generateFunctionAppName(pluginId);
 const credential = getAzureCredential();
 const storageConnectionString = await getStorageConnectionString(credential);


 await createFunctionApp(functionAppName, storageConnectionString);
 const deployResult = await deployToFunctionApp(functionAppName, zipBuffer);


 return {
   success: true,
   functionAppName,
   functionUrl: deployResult.functionUrl,
   warnings: validation.warnings
 };
}


module.exports = {
 validateZipStructure,
 generateFunctionAppName,
 deployPlugin,
 deleteFunctionApp,
 getFunctionAppStatus,
 getAzureCredential,
};
```




### 4.2 Create `controllers/deploy.controller.js`


Create the file at `Lumina/lumina-web-be/controllers/deploy.controller.js`:


```javascript
/**
* Deploy Controller - HTTP handlers for deployment endpoints
*/
const Plugin = require("../models/plugin.model");
const deploymentService = require("../services/deploymentService");


// POST /api/deploy/validate - Validate zip file structure
async function validateZip(req, res) {
 try {
   if (!req.file) {
     return res.status(400).json({ success: false, errors: ["No file uploaded"] });
   }


   const result = deploymentService.validateZipStructure(req.file.buffer);
   res.json({
     success: result.valid,
     errors: result.errors,
     warnings: result.warnings,
     fileCount: result.fileCount,
   });
 } catch (error) {
   console.error("Validation error:", error);
   res.status(500).json({ success: false, errors: [error.message] });
 }
}


// POST /api/deploy/:pluginId - Deploy zip to Azure Functions
async function deployPlugin(req, res) {
 try {
   const { pluginId } = req.params;
   const { userEmail } = req.body;


   if (!req.file) {
     return res.status(400).json({ success: false, errors: ["No file uploaded"] });
   }


   // Find plugin and verify ownership
   const plugin = await Plugin.findById(pluginId);
   if (!plugin) {
     return res.status(404).json({ success: false, errors: ["Plugin not found"] });
   }
   if (plugin.userEmail !== userEmail) {
     return res.status(403).json({ success: false, errors: ["Not authorized"] });
   }


   // Deploy to Azure
   const result = await deploymentService.deployPlugin(pluginId, req.file.buffer);


   if (!result.success) {
     return res.status(400).json(result);
   }


   // Update plugin with deployment info
   plugin.deploymentType = "managed";
   plugin.functionAppName = result.functionAppName;
   plugin.endpoint = result.functionUrl;
   await plugin.save();


   res.json({
     success: true,
     functionAppName: result.functionAppName,
     functionUrl: result.functionUrl,
     warnings: result.warnings,
   });
 } catch (error) {
   console.error("Deployment error:", error);
   res.status(500).json({ success: false, errors: [error.message] });
 }
}


// GET /api/deploy/:pluginId/status - Get deployment status
async function getDeploymentStatus(req, res) {
 try {
   const { pluginId } = req.params;
   const plugin = await Plugin.findById(pluginId);


   if (!plugin) {
     return res.status(404).json({ success: false, errors: ["Plugin not found"] });
   }


   if (plugin.deploymentType !== "managed" || !plugin.functionAppName) {
     return res.json({
       success: true,
       deploymentType: plugin.deploymentType || "external",
       deployed: false,
     });
   }


   const status = await deploymentService.getFunctionAppStatus(plugin.functionAppName);
   res.json({
     success: true,
     deploymentType: "managed",
     deployed: status.exists,
     functionAppName: plugin.functionAppName,
     state: status.state,
     url: status.url,
   });
 } catch (error) {
   console.error("Status error:", error);
   res.status(500).json({ success: false, errors: [error.message] });
 }
}


// DELETE /api/deploy/:pluginId - Delete deployment
async function deleteDeployment(req, res) {
 try {
   const { pluginId } = req.params;
   const { userEmail } = req.query;


   const plugin = await Plugin.findById(pluginId);
   if (!plugin) {
     return res.status(404).json({ success: false, errors: ["Plugin not found"] });
   }
   if (plugin.userEmail !== userEmail) {
     return res.status(403).json({ success: false, errors: ["Not authorized"] });
   }


   if (plugin.functionAppName) {
     await deploymentService.deleteFunctionApp(plugin.functionAppName);
   }


   plugin.deploymentType = "external";
   plugin.functionAppName = undefined;
   plugin.endpoint = "";
   await plugin.save();


   res.json({ success: true, message: "Deployment deleted" });
 } catch (error) {
   console.error("Delete error:", error);
   res.status(500).json({ success: false, errors: [error.message] });
 }
}


module.exports = { validateZip, deployPlugin, getDeploymentStatus, deleteDeployment };
```




### 4.3 Create `routes/deploy.route.js`


Create the file at `Lumina/lumina-web-be/routes/deploy.route.js`:


```javascript
/**
* Deploy Routes - File upload with multer middleware
*/
const express = require("express");
const multer = require("multer");
const deployController = require("../controllers/deploy.controller");


const router = express.Router();


// Configure multer for memory storage (no disk writes)
const upload = multer({
 storage: multer.memoryStorage(),
 limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
 fileFilter: (req, file, cb) => {
   if (file.mimetype === "application/zip" ||
       file.mimetype === "application/x-zip-compressed" ||
       file.originalname.endsWith(".zip")) {
     cb(null, true);
   } else {
     cb(new Error("Only .zip files are allowed"), false);
   }
 },
});


// Validate zip structure without deploying
router.post("/validate", upload.single("file"), deployController.validateZip);


// Deploy zip to Azure Functions
router.post("/:pluginId", upload.single("file"), deployController.deployPlugin);


// Get deployment status
router.get("/:pluginId/status", deployController.getDeploymentStatus);


// Delete deployment
router.delete("/:pluginId", deployController.deleteDeployment);


module.exports = router;
```


### Verification - Backend Files Created


After creating all three files, verify:


```bash
ls -la Lumina/lumina-web-be/services/
ls -la Lumina/lumina-web-be/controllers/
ls -la Lumina/lumina-web-be/routes/
```


**Expected:** You should see `deploymentService.js`, `deploy.controller.js`, and `deploy.route.js`.


---


## Step 5: Test Backend Startup


```bash
cd Lumina/lumina-web-be
npm run dev
```


### Verification
```bash
curl http://localhost:8080/health
```


**Expected:** `OK` (if MongoDB is connected) or `DB not connected` (if not).


Check the console for errors. If you see:
- `Cannot find module './routes/deploy.route'` → File not created correctly
- `Azure credentials not configured` → This is OK, means env vars aren't set yet


---


## Step 6: Test API Endpoints


### 6.1 Test Validate Endpoint (without Azure)


Create a test zip file:


```bash
mkdir test-function && cd test-function
echo 'import azure.functions as func' > function_app.py
echo 'azure-functions' > requirements.txt
echo '{"version": "2.0"}' > host.json
zip -r ../test-function.zip .
cd .. && rm -rf test-function
```


Test validation:


```bash
curl -X POST http://localhost:8080/api/deploy/validate \
 -F "file=@test-function.zip"
```


**Expected:**
```json
{"success":true,"errors":[],"warnings":[],"fileCount":3}
```


### 6.2 Test with Invalid Zip


```bash
echo "not a zip" > fake.zip
curl -X POST http://localhost:8080/api/deploy/validate \
 -F "file=@fake.zip"
```


**Expected:**
```json
{"success":false,"errors":["Invalid zip file: ..."],"warnings":[],"fileCount":0}
```


---


## Step 7: Frontend Changes (Optional - Full Integration)


If you want full UI integration, make these frontend changes:


### 7.1 Create `DeploymentModeSelector.jsx`


Create at `Lumina/lumina-web-fe/src/components/create/DeploymentModeSelector.jsx`:


```jsx
import React, { useCallback, useState } from 'react';
import {
 Box, Typography, ToggleButtonGroup, ToggleButton, Alert,
 Paper, LinearProgress, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { CloudUpload, Link as LinkIcon, CheckCircle, Error, Warning } from '@mui/icons-material';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


export default function DeploymentModeSelector({
 deploymentMode, setDeploymentMode, zipFile, setZipFile, validationResult, setValidationResult
}) {
 const [validating, setValidating] = useState(false);
 const [dragActive, setDragActive] = useState(false);


 const handleModeChange = (_, newMode) => {
   if (newMode) {
     setDeploymentMode(newMode);
     if (newMode === 'external') {
       setZipFile(null);
       setValidationResult(null);
     }
   }
 };


 const validateFile = useCallback(async (file) => {
   setValidating(true);
   setValidationResult(null);
   try {
     const formData = new FormData();
     formData.append('file', file);
     const response = await axios.post(`${API_URL}/api/deploy/validate`, formData, {
       headers: { 'Content-Type': 'multipart/form-data' },
     });
     setValidationResult(response.data);
     if (response.data.success) setZipFile(file);
   } catch (error) {
     setValidationResult({
       success: false,
       errors: [error.response?.data?.errors?.[0] || error.message]
     });
   } finally {
     setValidating(false);
   }
 }, [setZipFile, setValidationResult]);


 const handleDrop = useCallback((e) => {
   e.preventDefault();
   setDragActive(false);
   const file = e.dataTransfer.files[0];
   if (file?.name.endsWith('.zip')) validateFile(file);
 }, [validateFile]);


 const handleFileInput = (e) => {
   const file = e.target.files[0];
   if (file) validateFile(file);
 };


 return (
   <Box sx={{ mb: 3 }}>
     <Typography variant="h6" gutterBottom>Deployment Mode</Typography>


     <ToggleButtonGroup value={deploymentMode} exclusive onChange={handleModeChange} sx={{ mb: 2 }}>
       <ToggleButton value="external"><LinkIcon sx={{ mr: 1 }} /> External Endpoint</ToggleButton>
       <ToggleButton value="managed"><CloudUpload sx={{ mr: 1 }} /> Managed Deployment</ToggleButton>
     </ToggleButtonGroup>


     {deploymentMode === 'managed' && (
       <Paper
         onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
         onDragLeave={() => setDragActive(false)}
         onDrop={handleDrop}
         sx={{
           p: 3, border: '2px dashed', textAlign: 'center',
           borderColor: dragActive ? 'primary.main' : 'grey.400',
           bgcolor: dragActive ? 'action.hover' : 'background.paper',
         }}
       >
         <CloudUpload sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
         <Typography>Drag & drop your Azure Function zip file here</Typography>
         <Typography variant="body2" color="textSecondary">or</Typography>
         <input type="file" accept=".zip" onChange={handleFileInput} style={{ marginTop: 8 }} />


         {validating && <LinearProgress sx={{ mt: 2 }} />}


         {validationResult && (
           <Alert severity={validationResult.success ? 'success' : 'error'} sx={{ mt: 2, textAlign: 'left' }}>
             {validationResult.success ? (
               <>
                 <CheckCircle color="success" /> Valid zip file ({validationResult.fileCount} files)
                 {validationResult.warnings?.map((w, i) => (
                   <Typography key={i} variant="body2" color="warning.main">⚠️ {w}</Typography>
                 ))}
               </>
             ) : (
               <List dense>
                 {validationResult.errors?.map((e, i) => (
                   <ListItem key={i}>
                     <ListItemIcon><Error color="error" /></ListItemIcon>
                     <ListItemText primary={e} />
                   </ListItem>
                 ))}
               </List>
             )}
           </Alert>
         )}
       </Paper>
     )}


     {deploymentMode === 'external' && (
       <Alert severity="info">You will provide your own hosted endpoint URL in the next step.</Alert>
     )}
   </Box>
 );
}
```


### 7.2 Modify `Create.jsx`


Add these imports and state variables to `Create.jsx`:


```jsx
// Add import at top
import DeploymentModeSelector from '../../../components/create/DeploymentModeSelector';


// Add state variables inside the component
const [deploymentMode, setDeploymentMode] = useState('external');
const [zipFile, setZipFile] = useState(null);
const [validationResult, setValidationResult] = useState(null);
const [isDeploying, setIsDeploying] = useState(false);
```


Add the component in the appropriate step of the wizard (before endpoint form):


```jsx
<DeploymentModeSelector
 deploymentMode={deploymentMode}
 setDeploymentMode={setDeploymentMode}
 zipFile={zipFile}
 setZipFile={setZipFile}
 validationResult={validationResult}
 setValidationResult={setValidationResult}
/>
```


Modify the `handleSubmit` function to deploy after plugin creation:


```jsx
// After plugin is created successfully
if (deploymentMode === 'managed' && zipFile && response.data._id) {
 setIsDeploying(true);
 try {
   const deployFormData = new FormData();
   deployFormData.append('file', zipFile);
   deployFormData.append('userEmail', user.email);


   await axios.post(
     `${API_URL}/api/deploy/${response.data._id}`,
     deployFormData,
     { headers: { 'Content-Type': 'multipart/form-data' } }
   );
 } catch (deployError) {
   console.error('Deployment failed:', deployError);
   // Plugin is created, but deployment failed - user can retry
 } finally {
   setIsDeploying(false);
 }
}
```


### 7.3 Modify `ReviewForm.jsx`


Add deployment mode display:


```jsx
import { Chip } from '@mui/material';
import { Cloud, Link as LinkIcon } from '@mui/icons-material';


// Add in the review section
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
 <Typography variant="subtitle2">Deployment:</Typography>
 {deploymentMode === 'managed' ? (
   <Chip icon={<Cloud />} label="Managed Deployment" color="primary" size="small" />
 ) : (
   <Chip icon={<LinkIcon />} label="External Endpoint" variant="outlined" size="small" />
 )}
</Box>
```


---


## Step 8: Full End-to-End Test (With Azure)


Once environment variables are configured:


### 8.1 Create a Test Plugin in Database


```bash
# First, create a plugin via the API or UI
# Note the plugin ID from the response
```


### 8.2 Test Full Deployment


```bash
PLUGIN_ID="your-plugin-id-here"
USER_EMAIL="your-email@example.com"


curl -X POST "http://localhost:8080/api/deploy/${PLUGIN_ID}" \
 -F "file=@test-function.zip" \
 -F "userEmail=${USER_EMAIL}"
```


**Expected (on success):**
```json
{
 "success": true,
 "functionAppName": "lumina-xxxxxxxx-xxxxxxxx",
 "functionUrl": "https://lumina-xxxxxxxx-xxxxxxxx.azurewebsites.net",
 "warnings": []
}
```


### 8.3 Verify in Azure Portal


1. Go to Azure Portal → Resource Groups → lumina-deployments-rg
2. You should see a new Function App created
3. Click on the Function App → Functions → Should show your deployed function


### 8.4 Test the Deployed Function


```bash
curl "https://lumina-xxxxxxxx-xxxxxxxx.azurewebsites.net/api/http_trigger?query=hello"
```


---


## Troubleshooting


| Issue | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Missing file | Verify file paths match exactly |
| `Azure credentials not configured` | Missing env vars | Check `.env` file |
| `Deployment failed: 401` | Invalid credentials | Regenerate service principal |
| `Deployment failed: 403` | Missing permissions | Add Contributor role |
| `Request entity too large` | Zip > 50MB | Reduce zip size |
| `CORS error` in browser | Missing CORS config | Check `FRONTEND_ORIGIN` env var |


---


## Summary Checklist


- [ ] Step 1: Dependencies installed (`npm install`)
- [ ] Step 2: Azure resources created (RG, Storage, SP)
- [ ] Step 3: Environment variables configured
- [ ] Step 4: Backend files created (3 files)
- [ ] Step 5: Backend starts without errors
- [ ] Step 6: Validation endpoint works
- [ ] Step 7: Frontend components added (optional)
- [ ] Step 8: Full deployment test passes


---


## Next Steps


After completing this setup:


1. **Production deployment**: Update Azure App Service with new environment variables
2. **CI/CD integration**: Add deployment API tests to pipeline
3. **Monitoring**: Set up Azure Application Insights for deployed functions
4. **Documentation**: Update user documentation for managed deployment option





