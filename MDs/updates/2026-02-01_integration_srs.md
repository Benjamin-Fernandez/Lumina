# Lumina Deployment Automation - Implementation Guide


## Overview


This document provides step-by-step implementation instructions for adding automated Azure Function deployment to the Lumina platform. It is designed for AI code assistants to follow sequentially.


**Goal:** Enable developers to upload a zip file containing their chatbot code and automatically deploy it to Azure Functions.


**Scope:** Managed deployment only (using Lumina's Azure resources).


---


## Table of Contents


1. [Prerequisites](#1-prerequisites)
2. [Phase 1: Backend Foundation (Week 1)](#2-phase-1-backend-foundation)
3. [Phase 2: Frontend Integration (Week 2)](#3-phase-2-frontend-integration)
4. [Phase 3: Integration Testing (Week 3)](#4-phase-3-integration-testing)
5. [Phase 4: Polish & Documentation (Week 4)](#5-phase-4-polish--documentation)
6. [Validation Checklist](#6-validation-checklist)
7. [Troubleshooting](#7-troubleshooting)


---


## 1. Prerequisites


### 1.1 Required Environment Variables


Add these to `Lumina/lumina-web-be/.env`:


```bash
# Azure Deployment Configuration (Managed Mode)
AZURE_SUBSCRIPTION_ID=your-subscription-id
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_RESOURCE_GROUP=lumina-deployments-rg
AZURE_STORAGE_ACCOUNT=luminadeploymentstorage
AZURE_APP_INSIGHTS_KEY=your-app-insights-instrumentation-key
AZURE_LOCATION=southeastasia
```


### 1.2 Required NPM Packages (Backend)


Run in `Lumina/lumina-web-be/`:


```bash
npm install @azure/identity @azure/arm-appservice @azure/arm-storage adm-zip multer uuid
```


### 1.3 File Structure After Implementation


```
Lumina/lumina-web-be/
├── controllers/
│   └── deploy.controller.js      # NEW
├── services/
│   └── deploymentService.js      # NEW
├── routes/
│   ├── plugin.route.js
│   └── deploy.route.js           # NEW
├── models/
│   └── plugin.model.js           # MODIFIED (2 new fields)
└── index.js                      # MODIFIED (add deploy route)


Lumina/lumina-web-fe/src/
├── components/create/
│   ├── DeploymentModeSelector.jsx  # NEW
│   ├── PluginEndpointForm.jsx
│   └── ReviewForm.jsx              # MODIFIED
└── screens/developer/create/
   └── Create.jsx                  # MODIFIED
```


---


## 2. Phase 1: Backend Foundation


### Task 1.1: Update Plugin Model


**File:** `Lumina/lumina-web-be/models/plugin.model.js`


**Action:** Add 2 new optional fields to the schema.


**Find this code (lines 64-71):**
```javascript
  apiKey: {
    type: String,
    required: false,
  },
},
{
  timestamps: true,
}
```


**Replace with:**
```javascript
  apiKey: {
    type: String,
    required: false,
  },
  // NEW: Deployment automation fields
  deploymentType: {
    type: String,
    enum: ['external', 'managed'],
    default: 'external',
    required: false,
  },
  functionAppName: {
    type: String,
    required: false,
  },
},
{
  timestamps: true,
}
```


**Validation:**
- [ ] File saves without syntax errors
- [ ] Server starts without errors: `npm run dev`
- [ ] Existing plugins still load correctly


---


### Task 1.2: Create Deployment Service


**File:** `Lumina/lumina-web-be/services/deploymentService.js` (NEW FILE)


**Action:** Create the core deployment logic file.


```javascript
/**
* Deployment Service
* Handles zip validation and Azure Function deployment
* Ported from: chatbot-middleware/mkiats-dev-deployment/azureFunctionDeployerClient.py
*/


const { DefaultAzureCredential, ClientSecretCredential } = require("@azure/identity");
const { WebSiteManagementClient } = require("@azure/arm-appservice");
const { StorageManagementClient } = require("@azure/arm-storage");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");


class DeploymentService {
 constructor() {
   this.credential = null;
   this.webClient = null;
   this.storageClient = null;
   this.subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
   this.resourceGroupName = process.env.AZURE_RESOURCE_GROUP;
   this.storageAccountName = process.env.AZURE_STORAGE_ACCOUNT;
   this.appInsightsKey = process.env.AZURE_APP_INSIGHTS_KEY;
   this.location = process.env.AZURE_LOCATION || "southeastasia";
 }


 /**
  * Initialize Azure clients
  */
 async initialize() {
   this.credential = new ClientSecretCredential(
     process.env.AZURE_TENANT_ID,
     process.env.AZURE_CLIENT_ID,
     process.env.AZURE_CLIENT_SECRET
   );


   this.webClient = new WebSiteManagementClient(
     this.credential,
     this.subscriptionId
   );


   this.storageClient = new StorageManagementClient(
     this.credential,
     this.subscriptionId
   );
 }
```


**Continue adding to the same file (deploymentService.js):**


```javascript
 /**
  * Validate uploaded zip file structure
  * Required files: function_app.py, requirements.txt, host.json
  * @param {Buffer} zipBuffer - The uploaded zip file as buffer
  * @returns {Object} - { valid: boolean, errors: string[], warnings: string[] }
  */
 validateZipStructure(zipBuffer) {
   const errors = [];
   const warnings = [];
   const requiredFiles = ["function_app.py", "requirements.txt", "host.json"];


   try {
     const zip = new AdmZip(zipBuffer);
     const entries = zip.getEntries();
     const fileNames = entries.map(e => e.entryName.replace(/^[^/]+\//, ""));


     // Check required files
     for (const required of requiredFiles) {
       if (!fileNames.some(f => f === required || f.endsWith(`/${required}`))) {
         errors.push(`Missing required file: ${required}`);
       }
     }


     // Check for local.settings.json (should not be included)
     if (fileNames.some(f => f.includes("local.settings.json"))) {
       warnings.push("local.settings.json found - will be ignored in deployment");
     }


     // Check for __pycache__ directories
     if (fileNames.some(f => f.includes("__pycache__"))) {
       warnings.push("__pycache__ directories found - consider excluding");
     }


     return {
       valid: errors.length === 0,
       errors,
       warnings,
       fileCount: entries.length
     };
   } catch (err) {
     return {
       valid: false,
       errors: [`Invalid zip file: ${err.message}`],
       warnings: [],
       fileCount: 0
     };
   }
 }


 /**
  * Generate unique function app name
  * Format: lumina-{pluginId}-{shortUuid}
  * @param {string} pluginId - The plugin's MongoDB ID
  * @returns {string} - Azure-compliant function app name
  */
 generateFunctionAppName(pluginId) {
   const shortUuid = uuidv4().split("-")[0];
   // Azure function names: 2-60 chars, alphanumeric and hyphens
   const baseName = `lumina-${pluginId.slice(-8)}-${shortUuid}`;
   return baseName.toLowerCase().slice(0, 60);
 }


 /**
  * Create App Service Plan if not exists
  * Uses Consumption plan (Y1) for cost efficiency
  */
 async ensureAppServicePlan() {
   const planName = "lumina-consumption-plan";


   try {
     await this.webClient.appServicePlans.get(
       this.resourceGroupName,
       planName
     );
     console.log(`App Service Plan ${planName} already exists`);
     return planName;
   } catch (err) {
     if (err.statusCode === 404) {
       console.log(`Creating App Service Plan: ${planName}`);
       await this.webClient.appServicePlans.beginCreateOrUpdateAndWait(
         this.resourceGroupName,
         planName,
         {
           location: this.location,
           sku: {
             name: "Y1",
             tier: "Dynamic"
           },
           reserved: true, // Required for Linux
           kind: "linux"
         }
       );
       return planName;
     }
     throw err;
   }
 }


 /**
  * Deploy function app to Azure
  * @param {string} functionAppName - Name for the function app
  * @param {Buffer} zipBuffer - The validated zip file
  * @param {Object} options - Additional options (pluginId, developerId)
  * @returns {Object} - { success, functionUrl, error }
  */
 async deployFunctionApp(functionAppName, zipBuffer, options = {}) {
   try {
     await this.initialize();


     // Ensure App Service Plan exists
     const planName = await this.ensureAppServicePlan();


     // Get storage connection string
     const storageKeys = await this.storageClient.storageAccounts.listKeys(
       this.resourceGroupName,
       this.storageAccountName
     );
     const storageKey = storageKeys.keys[0].value;
     const storageConnectionString =
       `DefaultEndpointsProtocol=https;AccountName=${this.storageAccountName};` +
       `AccountKey=${storageKey};EndpointSuffix=core.windows.net`;


     // Create Function App
     console.log(`Creating Function App: ${functionAppName}`);
     const functionApp = await this.webClient.webApps.beginCreateOrUpdateAndWait(
       this.resourceGroupName,
       functionAppName,
       {
         location: this.location,
         kind: "functionapp,linux",
         serverFarmId: `/subscriptions/${this.subscriptionId}/resourceGroups/${this.resourceGroupName}/providers/Microsoft.Web/serverfarms/${planName}`,
         siteConfig: {
           linuxFxVersion: "Python|3.11",
           appSettings: [
             { name: "AzureWebJobsStorage", value: storageConnectionString },
             { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
             { name: "FUNCTIONS_WORKER_RUNTIME", value: "python" },
             { name: "APPINSIGHTS_INSTRUMENTATIONKEY", value: this.appInsightsKey },
             { name: "SCM_DO_BUILD_DURING_DEPLOYMENT", value: "true" },
             { name: "LUMINA_PLUGIN_ID", value: options.pluginId || "" },
             { name: "LUMINA_DEVELOPER_ID", value: options.developerId || "" }
           ]
         },
         httpsOnly: true
       }
     );


     // Deploy zip package using Kudu API
     console.log(`Deploying code to: ${functionAppName}`);
     const publishCreds = await this.webClient.webApps.listPublishingCredentials(
       this.resourceGroupName,
       functionAppName
     );


     const kuduUrl = `https://${functionAppName}.scm.azurewebsites.net/api/zipdeploy`;
     const auth = Buffer.from(
       `${publishCreds.publishingUserName}:${publishCreds.publishingPassword}`
     ).toString("base64");


     const axios = require("axios");
     await axios.post(kuduUrl, zipBuffer, {
       headers: {
         "Authorization": `Basic ${auth}`,
         "Content-Type": "application/zip"
       },
       maxContentLength: Infinity,
       maxBodyLength: Infinity,
       timeout: 300000 // 5 minute timeout for large deployments
     });


     // Get the function URL
     const functionUrl = `https://${functionAppName}.azurewebsites.net`;


     return {
       success: true,
       functionAppName,
       functionUrl,
       resourceGroup: this.resourceGroupName
     };


   } catch (err) {
     console.error("Deployment failed:", err);
     return {
       success: false,
       error: err.message,
       details: err.response?.data || err.stack
     };
   }
 }


 /**
  * Delete a deployed function app
  * @param {string} functionAppName - Name of the function app to delete
  */
 async deleteFunctionApp(functionAppName) {
   try {
     await this.initialize();
     await this.webClient.webApps.delete(
       this.resourceGroupName,
       functionAppName,
       { deleteEmptyServerFarm: false }
     );
     return { success: true };
   } catch (err) {
     return { success: false, error: err.message };
   }
 }


 /**
  * Get deployment status
  * @param {string} functionAppName - Name of the function app
  */
 async getDeploymentStatus(functionAppName) {
   try {
     await this.initialize();
     const app = await this.webClient.webApps.get(
       this.resourceGroupName,
       functionAppName
     );
     return {
       exists: true,
       state: app.state,
       url: `https://${functionAppName}.azurewebsites.net`,
       lastModified: app.lastModifiedTimeUtc
     };
   } catch (err) {
     if (err.statusCode === 404) {
       return { exists: false };
     }
     throw err;
   }
 }
}


module.exports = new DeploymentService();
```


**Validation for Task 1.2:**
- [ ] File created at `Lumina/lumina-web-be/services/deploymentService.js`
- [ ] No syntax errors when requiring the module
- [ ] Test: `node -e "require('./services/deploymentService')"`


---


### Task 1.3: Create Deploy Controller


**File:** `Lumina/lumina-web-be/controllers/deploy.controller.js` (NEW FILE)


**Action:** Create controller with 4 endpoints.


```javascript
/**
* Deployment Controller
* Handles HTTP requests for plugin deployment operations
*/


const deploymentService = require("../services/deploymentService");
const Plugin = require("../models/plugin.model");


/**
* POST /api/deploy/validate
* Validate zip file structure before deployment
*/
exports.validateZip = async (req, res) => {
 try {
   if (!req.file) {
     return res.status(400).json({
       success: false,
       error: "No zip file uploaded"
     });
   }


   const result = deploymentService.validateZipStructure(req.file.buffer);


   return res.status(result.valid ? 200 : 400).json({
     success: result.valid,
     errors: result.errors,
     warnings: result.warnings,
     fileCount: result.fileCount
   });
 } catch (err) {
   console.error("Validation error:", err);
   return res.status(500).json({
     success: false,
     error: "Validation failed",
     details: err.message
   });
 }
};


/**
* POST /api/deploy/:pluginId
* Deploy zip file to Azure Functions for a specific plugin
*/
exports.deployPlugin = async (req, res) => {
 try {
   const { pluginId } = req.params;


   // Verify plugin exists and user has permission
   const plugin = await Plugin.findById(pluginId);
   if (!plugin) {
     return res.status(404).json({
       success: false,
       error: "Plugin not found"
     });
   }


   // Check authorization (plugin owner or admin)
   if (plugin.developerId.toString() !== req.user._id.toString()) {
     return res.status(403).json({
       success: false,
       error: "Not authorized to deploy this plugin"
     });
   }


   if (!req.file) {
     return res.status(400).json({
       success: false,
       error: "No zip file uploaded"
     });
   }


   // Validate zip structure first
   const validation = deploymentService.validateZipStructure(req.file.buffer);
   if (!validation.valid) {
     return res.status(400).json({
       success: false,
       error: "Invalid zip structure",
       details: validation.errors
     });
   }


   // Generate function app name
   const functionAppName = deploymentService.generateFunctionAppName(pluginId);


   // Deploy to Azure
   const deployResult = await deploymentService.deployFunctionApp(
     functionAppName,
     req.file.buffer,
     {
       pluginId: pluginId,
       developerId: plugin.developerId.toString()
     }
   );


   if (!deployResult.success) {
     return res.status(500).json({
       success: false,
       error: "Deployment failed",
       details: deployResult.error
     });
   }


   // Update plugin with deployment info
   plugin.deploymentType = "managed";
   plugin.functionAppName = functionAppName;
   plugin.pluginUrl = deployResult.functionUrl;
   await plugin.save();


   return res.status(200).json({
     success: true,
     message: "Deployment successful",
     functionAppName: functionAppName,
     functionUrl: deployResult.functionUrl,
     warnings: validation.warnings
   });


 } catch (err) {
   console.error("Deployment error:", err);
   return res.status(500).json({
     success: false,
     error: "Deployment failed",
     details: err.message
   });
 }
};


/**
* GET /api/deploy/:pluginId/status
* Get deployment status for a plugin
*/
exports.getDeploymentStatus = async (req, res) => {
 try {
   const { pluginId } = req.params;


   const plugin = await Plugin.findById(pluginId);
   if (!plugin) {
     return res.status(404).json({
       success: false,
       error: "Plugin not found"
     });
   }


   if (plugin.deploymentType !== "managed" || !plugin.functionAppName) {
     return res.status(200).json({
       success: true,
       deploymentType: plugin.deploymentType || "external",
       managed: false
     });
   }


   const status = await deploymentService.getDeploymentStatus(plugin.functionAppName);


   return res.status(200).json({
     success: true,
     deploymentType: "managed",
     managed: true,
     functionAppName: plugin.functionAppName,
     ...status
   });


 } catch (err) {
   console.error("Status check error:", err);
   return res.status(500).json({
     success: false,
     error: "Failed to get deployment status",
     details: err.message
   });
 }
};


/**
* DELETE /api/deploy/:pluginId
* Delete deployed function app
*/
exports.deleteDeployment = async (req, res) => {
 try {
   const { pluginId } = req.params;


   const plugin = await Plugin.findById(pluginId);
   if (!plugin) {
     return res.status(404).json({
       success: false,
       error: "Plugin not found"
     });
   }


   // Check authorization
   if (plugin.developerId.toString() !== req.user._id.toString()) {
     return res.status(403).json({
       success: false,
       error: "Not authorized to delete this deployment"
     });
   }


   if (!plugin.functionAppName) {
     return res.status(400).json({
       success: false,
       error: "No managed deployment found for this plugin"
     });
   }


   const result = await deploymentService.deleteFunctionApp(plugin.functionAppName);


   if (!result.success) {
     return res.status(500).json({
       success: false,
       error: "Failed to delete deployment",
       details: result.error
     });
   }


   // Update plugin to remove deployment info
   plugin.deploymentType = "external";
   plugin.functionAppName = null;
   plugin.pluginUrl = "";
   await plugin.save();


   return res.status(200).json({
     success: true,
     message: "Deployment deleted successfully"
   });


 } catch (err) {
   console.error("Delete deployment error:", err);
   return res.status(500).json({
     success: false,
     error: "Failed to delete deployment",
     details: err.message
   });
 }
};
```


**Validation for Task 1.3:**
- [ ] File created at `Lumina/lumina-web-be/controllers/deploy.controller.js`
- [ ] No syntax errors
- [ ] All 4 exports present: `validateZip`, `deployPlugin`, `getDeploymentStatus`, `deleteDeployment`


---


### Task 1.4: Create Deploy Routes


**File:** `Lumina/lumina-web-be/routes/deploy.route.js` (NEW FILE)


**Action:** Create route definitions with multer middleware.


```javascript
/**
* Deployment Routes
* All routes require authentication
*/


const express = require("express");
const router = express.Router();
const multer = require("multer");
const deployController = require("../controllers/deploy.controller");
const { verifyToken } = require("../middleware/auth");


// Configure multer for zip file uploads
const storage = multer.memoryStorage();
const upload = multer({
 storage: storage,
 limits: {
   fileSize: 50 * 1024 * 1024, // 50MB max
 },
 fileFilter: (req, file, cb) => {
   if (file.mimetype === "application/zip" ||
       file.mimetype === "application/x-zip-compressed" ||
       file.originalname.endsWith(".zip")) {
     cb(null, true);
   } else {
     cb(new Error("Only .zip files are allowed"), false);
   }
 }
});


// All routes require authentication
router.use(verifyToken);


/**
* @route   POST /api/deploy/validate
* @desc    Validate zip file structure
* @access  Private
* @body    multipart/form-data with 'zipFile' field
*/
router.post("/validate", upload.single("zipFile"), deployController.validateZip);


/**
* @route   POST /api/deploy/:pluginId
* @desc    Deploy plugin code to Azure Functions
* @access  Private (plugin owner only)
* @body    multipart/form-data with 'zipFile' field
*/
router.post("/:pluginId", upload.single("zipFile"), deployController.deployPlugin);


/**
* @route   GET /api/deploy/:pluginId/status
* @desc    Get deployment status for a plugin
* @access  Private
*/
router.get("/:pluginId/status", deployController.getDeploymentStatus);


/**
* @route   DELETE /api/deploy/:pluginId
* @desc    Delete deployed function app
* @access  Private (plugin owner only)
*/
router.delete("/:pluginId", deployController.deleteDeployment);


module.exports = router;
```


**Validation for Task 1.4:**
- [ ] File created at `Lumina/lumina-web-be/routes/deploy.route.js`
- [ ] Module exports router object


---


### Task 1.5: Register Routes in Main Application


**File:** `Lumina/lumina-web-be/index.js`


**Action:** Add deploy routes to the Express application.


**Find this section (around lines 17-22):**
```javascript
const pluginRoute = require("./routes/plugin.route");
const userRoute = require("./routes/user.route");
const devRoute = require("./routes/developer.route");
```


**Add after:**
```javascript
const deployRoute = require("./routes/deploy.route");
```


**Find this section (around lines 37-41):**
```javascript
app.use("/api/plugin", pluginRoute);
app.use("/api/user", userRoute);
app.use("/api/dev", devRoute);
```


**Add after:**
```javascript
app.use("/api/deploy", deployRoute);
```


**Validation for Task 1.5:**
- [ ] Server starts without errors: `npm run dev`
- [ ] Route accessible: `curl -X POST http://localhost:8080/api/deploy/validate` (should return 401 without auth)




---


## 3. Phase 2: Frontend Integration


### Task 2.1: Create Deployment Mode Selector Component


**File:** `Lumina/lumina-web-fe/src/components/create/DeploymentModeSelector.jsx` (NEW FILE)


**Action:** Create a new component for selecting deployment mode.


```jsx
/**
* DeploymentModeSelector Component
* Allows developers to choose between external hosting and managed deployment
*/


import React, { useState, useCallback } from "react";
import {
 Box,
 Typography,
 Card,
 CardContent,
 CardActionArea,
 Radio,
 RadioGroup,
 FormControlLabel,
 Alert,
 Button,
 LinearProgress,
 Chip,
 useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import axios from "../../config/axiosConfig";


const DeploymentModeSelector = ({
 selectedMode,
 onModeChange,
 onValidationComplete,
 onFileSelect,
 accessToken
}) => {
 const theme = useTheme();
 const [uploadedFile, setUploadedFile] = useState(null);
 const [validationStatus, setValidationStatus] = useState(null); // null, 'validating', 'valid', 'invalid'
 const [validationResult, setValidationResult] = useState(null);
 const [dragActive, setDragActive] = useState(false);


 const handleModeChange = (event) => {
   const newMode = event.target.value;
   onModeChange(newMode);
   // Reset file state when switching modes
   if (newMode === "external") {
     setUploadedFile(null);
     setValidationStatus(null);
     setValidationResult(null);
     onFileSelect(null);
   }
 };


 const validateFile = useCallback(async (file) => {
   setValidationStatus("validating");


   const formData = new FormData();
   formData.append("zipFile", file);


   try {
     const response = await axios.post("/api/deploy/validate", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
         Authorization: `Bearer ${accessToken}`,
       },
     });


     if (response.data.success) {
       setValidationStatus("valid");
       setValidationResult(response.data);
       onValidationComplete(true, response.data);
       onFileSelect(file);
     } else {
       setValidationStatus("invalid");
       setValidationResult(response.data);
       onValidationComplete(false, response.data);
       onFileSelect(null);
     }
   } catch (error) {
     setValidationStatus("invalid");
     const errorResult = {
       success: false,
       errors: [error.response?.data?.error || "Validation failed"],
       warnings: [],
     };
     setValidationResult(errorResult);
     onValidationComplete(false, errorResult);
     onFileSelect(null);
   }
 }, [accessToken, onValidationComplete, onFileSelect]);


 const handleFileChange = (event) => {
   const file = event.target.files[0];
   if (file) {
     setUploadedFile(file);
     validateFile(file);
   }
 };


 const handleDrag = (e) => {
   e.preventDefault();
   e.stopPropagation();
   if (e.type === "dragenter" || e.type === "dragover") {
     setDragActive(true);
   } else if (e.type === "dragleave") {
     setDragActive(false);
   }
 };


 const handleDrop = (e) => {
   e.preventDefault();
   e.stopPropagation();
   setDragActive(false);


   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
     const file = e.dataTransfer.files[0];
     if (file.name.endsWith(".zip")) {
       setUploadedFile(file);
       validateFile(file);
     }
   }
 };


 const renderValidationStatus = () => {
   if (!validationStatus) return null;


   if (validationStatus === "validating") {
     return (
       <Box sx={{ mt: 2 }}>
         <LinearProgress />
         <Typography variant="body2" sx={{ mt: 1 }}>
           Validating zip structure...
         </Typography>
       </Box>
     );
   }


   if (validationStatus === "valid") {
     return (
       <Alert
         severity="success"
         icon={<CheckCircleIcon />}
         sx={{ mt: 2 }}
       >
         <Typography variant="body2" fontWeight="bold">
           Validation Successful
         </Typography>
         <Typography variant="body2">
           Found {validationResult?.fileCount} files. Ready for deployment.
         </Typography>
         {validationResult?.warnings?.length > 0 && (
           <Box sx={{ mt: 1 }}>
             {validationResult.warnings.map((warning, idx) => (
               <Chip
                 key={idx}
                 icon={<WarningIcon />}
                 label={warning}
                 size="small"
                 color="warning"
                 sx={{ mr: 0.5, mb: 0.5 }}
               />
             ))}
           </Box>
         )}
       </Alert>
     );
   }


   if (validationStatus === "invalid") {
     return (
       <Alert
         severity="error"
         icon={<ErrorIcon />}
         sx={{ mt: 2 }}
       >
         <Typography variant="body2" fontWeight="bold">
           Validation Failed
         </Typography>
         {validationResult?.errors?.map((error, idx) => (
           <Typography key={idx} variant="body2">
             • {error}
           </Typography>
         ))}
       </Alert>
     );
   }
 };


 return (
   <Box>
     <Typography variant="h6" gutterBottom>
       Deployment Method
     </Typography>
     <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
       Choose how you want to host your chatbot endpoint.
     </Typography>


     <RadioGroup value={selectedMode} onChange={handleModeChange}>
       {/* External Hosting Option */}
       <Card
         variant="outlined"
         sx={{
           mb: 2,
           borderColor: selectedMode === "external" ? "primary.main" : "divider",
           borderWidth: selectedMode === "external" ? 2 : 1,
         }}
       >
         <CardActionArea onClick={() => onModeChange("external")}>
           <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
             <FormControlLabel
               value="external"
               control={<Radio />}
               label=""
               sx={{ mr: 1, mt: -0.5 }}
             />
             <Box sx={{ flex: 1 }}>
               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                 <LinkIcon sx={{ mr: 1, color: "primary.main" }} />
                 <Typography variant="subtitle1" fontWeight="bold">
                   External Endpoint
                 </Typography>
               </Box>
               <Typography variant="body2" color="text.secondary">
                 Provide a URL to your already-deployed chatbot. You manage your own hosting infrastructure.
               </Typography>
               <Box sx={{ mt: 1 }}>
                 <Chip label="Bring Your Own Server" size="small" sx={{ mr: 0.5 }} />
                 <Chip label="Full Control" size="small" />
               </Box>
             </Box>
           </CardContent>
         </CardActionArea>
       </Card>


       {/* Managed Deployment Option */}
       <Card
         variant="outlined"
         sx={{
           borderColor: selectedMode === "managed" ? "primary.main" : "divider",
           borderWidth: selectedMode === "managed" ? 2 : 1,
         }}
       >
         <CardActionArea onClick={() => onModeChange("managed")}>
           <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
             <FormControlLabel
               value="managed"
               control={<Radio />}
               label=""
               sx={{ mr: 1, mt: -0.5 }}
             />
             <Box sx={{ flex: 1 }}>
               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                 <CloudUploadIcon sx={{ mr: 1, color: "secondary.main" }} />
                 <Typography variant="subtitle1" fontWeight="bold">
                   Managed Deployment
                 </Typography>
                 <Chip
                   label="Recommended"
                   size="small"
                   color="secondary"
                   sx={{ ml: 1 }}
                 />
               </Box>
               <Typography variant="body2" color="text.secondary">
                 Upload your Python Azure Function code as a zip file. We handle deployment and hosting automatically.
               </Typography>
               <Box sx={{ mt: 1 }}>
                 <Chip label="Zero Infrastructure" size="small" sx={{ mr: 0.5 }} />
                 <Chip label="Auto-scaling" size="small" sx={{ mr: 0.5 }} />
                 <Chip label="HTTPS Included" size="small" />
               </Box>
             </Box>
           </CardContent>
         </CardActionArea>
       </Card>
     </RadioGroup>


     {/* File Upload Section - Only shown for managed mode */}
     {selectedMode === "managed" && (
       <Box sx={{ mt: 3 }}>
         <Typography variant="subtitle2" gutterBottom>
           Upload Your Function Code
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
           Your zip file must contain: <code>function_app.py</code>, <code>requirements.txt</code>, and <code>host.json</code>
         </Typography>


         <Box
           onDragEnter={handleDrag}
           onDragLeave={handleDrag}
           onDragOver={handleDrag}
           onDrop={handleDrop}
           sx={{
             border: "2px dashed",
             borderColor: dragActive ? "primary.main" : "divider",
             borderRadius: 2,
             p: 4,
             textAlign: "center",
             backgroundColor: dragActive ? "action.hover" : "background.paper",
             cursor: "pointer",
             transition: "all 0.2s ease",
             "&:hover": {
               borderColor: "primary.main",
               backgroundColor: "action.hover",
             },
           }}
         >
           <input
             type="file"
             accept=".zip"
             onChange={handleFileChange}
             style={{ display: "none" }}
             id="zip-upload-input"
           />
           <label htmlFor="zip-upload-input" style={{ cursor: "pointer" }}>
             <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
             <Typography variant="body1">
               {uploadedFile ? uploadedFile.name : "Drop your zip file here or click to browse"}
             </Typography>
             <Typography variant="body2" color="text.secondary">
               Maximum file size: 50MB
             </Typography>
           </label>
         </Box>


         {renderValidationStatus()}
       </Box>
     )}
   </Box>
 );
};


export default DeploymentModeSelector;
```


**Validation for Task 2.1:**
- [ ] File created at `Lumina/lumina-web-fe/src/components/create/DeploymentModeSelector.jsx`
- [ ] No JSX syntax errors
- [ ] Component exports default




---


### Task 2.2: Modify Create.jsx to Include Deployment Mode


**File:** `Lumina/lumina-web-fe/src/screens/developer/create/Create.jsx`


**Action:** Add deployment mode state and integrate DeploymentModeSelector.


**Step 2.2.1: Add Import**


Find imports section (around line 1-15) and add:


```javascript
import DeploymentModeSelector from "../../../components/create/DeploymentModeSelector";
```


**Step 2.2.2: Add State Variables**


Find the existing state declarations (around lines 25-35) and add after them:


```javascript
// Deployment state
const [deploymentMode, setDeploymentMode] = useState("external");
const [deploymentFile, setDeploymentFile] = useState(null);
const [isZipValid, setIsZipValid] = useState(false);
const [deploymentValidation, setDeploymentValidation] = useState(null);
```


**Step 2.2.3: Add Handler Functions**


Add these handler functions after the existing handlers:


```javascript
const handleDeploymentModeChange = (mode) => {
 setDeploymentMode(mode);
 if (mode === "external") {
   setDeploymentFile(null);
   setIsZipValid(false);
   setDeploymentValidation(null);
 }
};


const handleDeploymentFileSelect = (file) => {
 setDeploymentFile(file);
};


const handleDeploymentValidationComplete = (isValid, result) => {
 setIsZipValid(isValid);
 setDeploymentValidation(result);
};
```


**Step 2.2.4: Modify getStepContent Function**


Find the `getStepContent` function. Add a new case for the deployment step.


Locate case 2 (Plugin Endpoint Form) and modify to include conditional rendering:


```javascript
case 2:
 if (deploymentMode === "external") {
   return (
     <PluginEndpointForm
       pluginUrl={pluginUrl}
       setPluginUrl={setPluginUrl}
       apiKey={apiKey}
       setApiKey={setApiKey}
     />
   );
 } else {
   // For managed deployment, show upload status summary
   return (
     <Box>
       <Typography variant="h6" gutterBottom>
         Deployment Configuration
       </Typography>
       {deploymentFile && (
         <Alert severity="success" sx={{ mb: 2 }}>
           <Typography variant="body2">
             <strong>Ready to deploy:</strong> {deploymentFile.name}
           </Typography>
           <Typography variant="body2" color="text.secondary">
             Endpoint URL will be generated after deployment.
           </Typography>
         </Alert>
       )}
     </Box>
   );
 }
```


**Step 2.2.5: Add Deployment Mode Step**


Modify the steps array to include deployment selection as step 2:


```javascript
const steps = [
 "Plugin Details",
 "Deployment Method",  // NEW - Insert as step 2
 "Plugin Endpoint",
 "Capabilities",
 "Review"
];
```


Add corresponding case in getStepContent:


```javascript
case 1:
 return (
   <DeploymentModeSelector
     selectedMode={deploymentMode}
     onModeChange={handleDeploymentModeChange}
     onValidationComplete={handleDeploymentValidationComplete}
     onFileSelect={handleDeploymentFileSelect}
     accessToken={accessToken}
   />
 );
```


**Step 2.2.6: Update Submit Handler**


Modify the submit handler to handle managed deployment:


```javascript
const handleSubmit = async () => {
 try {
   setIsSubmitting(true);


   // For managed deployment, we need to deploy first
   if (deploymentMode === "managed" && deploymentFile) {
     // First create the plugin to get the ID
     const createResponse = await axios.post(
       "/api/plugin/create",
       {
         // ... existing plugin data
         deploymentType: "managed",
         pluginUrl: "", // Will be updated after deployment
       },
       {
         headers: {
           Authorization: `Bearer ${accessToken}`,
         },
       }
     );


     const pluginId = createResponse.data.plugin._id;


     // Now deploy the code
     const formData = new FormData();
     formData.append("zipFile", deploymentFile);


     const deployResponse = await axios.post(
       `/api/deploy/${pluginId}`,
       formData,
       {
         headers: {
           "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${accessToken}`,
         },
       }
     );


     if (!deployResponse.data.success) {
       throw new Error(deployResponse.data.error);
     }


     toast.success("Plugin created and deployed successfully!");
     navigate("/developer/plugins");
     return;
   }


   // Existing logic for external deployment
   // ... rest of existing submit logic


 } catch (error) {
   toast.error(error.message || "Failed to create plugin");
 } finally {
   setIsSubmitting(false);
 }
};
```


**Step 2.2.7: Update Step Validation**


Modify the `isStepComplete` or validation logic:


```javascript
const canProceedFromStep = (step) => {
 switch (step) {
   case 0: // Plugin Details
     return pluginName && pluginDescription;
   case 1: // Deployment Method
     if (deploymentMode === "managed") {
       return isZipValid && deploymentFile;
     }
     return true; // External mode can always proceed
   case 2: // Plugin Endpoint
     if (deploymentMode === "external") {
       return pluginUrl && pluginUrl.startsWith("http");
     }
     return true; // Managed mode already validated
   case 3: // Capabilities
     return true;
   default:
     return true;
 }
};
```


**Validation for Task 2.2:**
- [ ] Frontend compiles without errors: `npm start`
- [ ] New step appears in stepper
- [ ] Mode selection works correctly
- [ ] File upload appears when managed mode selected


---


### Task 2.3: Modify ReviewForm.jsx


**File:** `Lumina/lumina-web-fe/src/components/create/ReviewForm.jsx`


**Action:** Update to display deployment-specific information.


**Find the existing ReviewForm component and add deployment info display:**


Add these props to the component:


```javascript
const ReviewForm = ({
 pluginName,
 pluginDescription,
 pluginUrl,
 capabilities,
 // NEW props:
 deploymentMode,
 deploymentFile,
 functionAppName
}) => {
```


Add a new section to display deployment info:


```javascript
{/* Deployment Information */}
<Box sx={{ mb: 3 }}>
 <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
   Deployment Configuration
 </Typography>
 <Grid container spacing={2}>
   <Grid item xs={4}>
     <Typography variant="body2" color="text.secondary">
       Deployment Type
     </Typography>
   </Grid>
   <Grid item xs={8}>
     <Chip
       label={deploymentMode === "managed" ? "Managed (Azure Functions)" : "External Endpoint"}
       color={deploymentMode === "managed" ? "secondary" : "primary"}
       size="small"
     />
   </Grid>


   {deploymentMode === "managed" && deploymentFile && (
     <>
       <Grid item xs={4}>
         <Typography variant="body2" color="text.secondary">
           Upload File
         </Typography>
       </Grid>
       <Grid item xs={8}>
         <Typography variant="body2">
           {deploymentFile.name} ({(deploymentFile.size / 1024).toFixed(1)} KB)
         </Typography>
       </Grid>
     </>
   )}


   {deploymentMode === "external" && (
     <>
       <Grid item xs={4}>
         <Typography variant="body2" color="text.secondary">
           Endpoint URL
         </Typography>
       </Grid>
       <Grid item xs={8}>
         <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
           {pluginUrl}
         </Typography>
       </Grid>
     </>
   )}
 </Grid>
</Box>
```


**Validation for Task 2.3:**
- [ ] Review page shows deployment info
- [ ] Correct mode displayed
- [ ] File info shown for managed deployments




---


## 4. Phase 3: Integration Testing


### Task 3.1: Create Test Zip File


**Action:** Create a valid Azure Functions zip for testing.


Create directory `test-fixtures/` with these files:


**File: `test-fixtures/function_app.py`**
```python
import azure.functions as func
import json
import logging


app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="chat", methods=["POST"])
def chat(req: func.HttpRequest) -> func.HttpResponse:
   """Test chatbot endpoint for Lumina integration testing."""
   logging.info("Chat function processed a request.")


   try:
       req_body = req.get_json()
       user_message = req_body.get("message", "")


       response = {
           "response": f"Echo: {user_message}",
           "status": "success"
       }


       return func.HttpResponse(
           json.dumps(response),
           mimetype="application/json",
           status_code=200
       )
   except Exception as e:
       logging.error(f"Error: {str(e)}")
       return func.HttpResponse(
           json.dumps({"error": str(e)}),
           status_code=500
       )
```


**File: `test-fixtures/requirements.txt`**
```
azure-functions
```


**File: `test-fixtures/host.json`**
```json
{
 "version": "2.0",
 "logging": {
   "applicationInsights": {
     "samplingSettings": {
       "isEnabled": true,
       "excludedTypes": "Request"
     }
   }
 },
 "extensionBundle": {
   "id": "Microsoft.Azure.Functions.ExtensionBundle",
   "version": "[4.*, 5.0.0)"
 }
}
```


**Create zip:**
```bash
cd test-fixtures
zip -r test-function.zip function_app.py requirements.txt host.json
```


---


### Task 3.2: Backend API Tests


**File:** `Lumina/lumina-web-be/tests/deploy.test.js` (NEW FILE - optional)


**Action:** Create integration tests for deployment endpoints.


```javascript
/**
* Deployment API Tests
* Run with: npm test -- --grep "Deployment"
*/


const request = require("supertest");
const app = require("../index"); // Ensure app is exported
const fs = require("fs");
const path = require("path");


describe("Deployment API", () => {
 let authToken;
 let testPluginId;


 beforeAll(async () => {
   // Get auth token - adjust based on your auth setup
   authToken = process.env.TEST_AUTH_TOKEN;
 });


 describe("POST /api/deploy/validate", () => {
   it("should reject non-zip files", async () => {
     const response = await request(app)
       .post("/api/deploy/validate")
       .set("Authorization", `Bearer ${authToken}`)
       .attach("zipFile", Buffer.from("not a zip"), "test.txt");


     expect(response.status).toBe(400);
     expect(response.body.success).toBe(false);
   });


   it("should reject zip without required files", async () => {
     // Create an empty zip
     const AdmZip = require("adm-zip");
     const zip = new AdmZip();
     zip.addFile("readme.txt", Buffer.from("test"));
     const zipBuffer = zip.toBuffer();


     const response = await request(app)
       .post("/api/deploy/validate")
       .set("Authorization", `Bearer ${authToken}`)
       .attach("zipFile", zipBuffer, "test.zip");


     expect(response.status).toBe(400);
     expect(response.body.errors).toContain("Missing required file: function_app.py");
   });


   it("should accept valid Azure Function zip", async () => {
     const testZipPath = path.join(__dirname, "../../test-fixtures/test-function.zip");


     if (!fs.existsSync(testZipPath)) {
       console.log("Skipping: test-function.zip not found");
       return;
     }


     const response = await request(app)
       .post("/api/deploy/validate")
       .set("Authorization", `Bearer ${authToken}`)
       .attach("zipFile", testZipPath);


     expect(response.status).toBe(200);
     expect(response.body.success).toBe(true);
     expect(response.body.fileCount).toBeGreaterThan(0);
   });
 });


 describe("GET /api/deploy/:pluginId/status", () => {
   it("should return 404 for non-existent plugin", async () => {
     const response = await request(app)
       .get("/api/deploy/000000000000000000000000/status")
       .set("Authorization", `Bearer ${authToken}`);


     expect(response.status).toBe(404);
   });


   it("should return external type for non-managed plugin", async () => {
     // Requires a valid pluginId
     if (!testPluginId) {
       console.log("Skipping: No test plugin available");
       return;
     }


     const response = await request(app)
       .get(`/api/deploy/${testPluginId}/status`)
       .set("Authorization", `Bearer ${authToken}`);


     expect(response.status).toBe(200);
     expect(response.body.deploymentType).toBe("external");
   });
 });
});
```


**Test Execution:**
```bash
cd Lumina/lumina-web-be
npm test -- --grep "Deployment"
```


---


### Task 3.3: Frontend Component Tests


**Test Cases Checklist:**


1. **DeploymentModeSelector Component**
  - [ ] Renders both mode options
  - [ ] Mode selection changes state
  - [ ] File upload appears only for managed mode
  - [ ] Drag-and-drop works
  - [ ] Validation feedback displays correctly
  - [ ] Invalid file shows error message
  - [ ] Valid file shows success message


2. **Create.jsx Integration**
  - [ ] New step appears in stepper
  - [ ] Step navigation works correctly
  - [ ] Form state persists across steps
  - [ ] Submit handles both deployment modes
  - [ ] Loading state during deployment


3. **ReviewForm.jsx Updates**
  - [ ] Shows correct mode badge
  - [ ] Displays file info for managed mode
  - [ ] Displays URL for external mode


---


### Task 3.4: End-to-End Test Scenario


**Manual Testing Steps:**


1. **External Mode Flow:**
  - [ ] Create new plugin
  - [ ] Select "External Endpoint" mode
  - [ ] Enter external URL
  - [ ] Complete wizard
  - [ ] Verify plugin created with `deploymentType: "external"`


2. **Managed Mode Flow (requires Azure credentials):**
  - [ ] Create new plugin
  - [ ] Select "Managed Deployment" mode
  - [ ] Upload test-function.zip
  - [ ] Wait for validation success
  - [ ] Complete wizard
  - [ ] Verify deployment progress
  - [ ] Verify plugin created with `deploymentType: "managed"`
  - [ ] Verify functionAppName populated
  - [ ] Test the deployed endpoint


3. **Error Scenarios:**
  - [ ] Upload invalid zip → shows error
  - [ ] Upload without required files → shows specific errors
  - [ ] Network error during validation → shows error
  - [ ] Azure deployment failure → shows error, plugin not created


---


## 5. Phase 4: Polish & Documentation


### Task 4.1: Add Loading States


**Action:** Ensure all async operations have loading indicators.


**Deployment Button States:**


```javascript
// In Create.jsx submit button
<Button
 variant="contained"
 onClick={handleSubmit}
 disabled={isSubmitting}
 startIcon={isSubmitting && <CircularProgress size={20} />}
>
 {isSubmitting
   ? (deploymentMode === "managed" ? "Deploying..." : "Creating...")
   : "Create Plugin"
 }
</Button>
```


### Task 4.2: Add Error Boundaries


**File:** `Lumina/lumina-web-fe/src/components/create/DeploymentErrorBoundary.jsx` (NEW FILE)


```jsx
import React from "react";
import { Alert, Button, Box } from "@mui/material";


class DeploymentErrorBoundary extends React.Component {
 constructor(props) {
   super(props);
   this.state = { hasError: false, error: null };
 }


 static getDerivedStateFromError(error) {
   return { hasError: true, error };
 }


 componentDidCatch(error, errorInfo) {
   console.error("Deployment component error:", error, errorInfo);
 }


 render() {
   if (this.state.hasError) {
     return (
       <Box sx={{ p: 3 }}>
         <Alert severity="error" sx={{ mb: 2 }}>
           Something went wrong with the deployment component.
         </Alert>
         <Button
           variant="outlined"
           onClick={() => this.setState({ hasError: false })}
         >
           Try Again
         </Button>
       </Box>
     );
   }


   return this.props.children;
 }
}


export default DeploymentErrorBoundary;
```


### Task 4.3: Add User Guidance


**Action:** Add tooltips and help text throughout the flow.


**Example tooltips:**


```jsx
import { Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";


// Add next to "Managed Deployment" option
<Tooltip title="Your code will be deployed to Azure Functions. We handle scaling, SSL, and monitoring automatically.">
 <IconButton size="small">
   <HelpOutlineIcon fontSize="small" />
 </IconButton>
</Tooltip>


// Add next to file upload
<Tooltip title="Create a zip containing function_app.py, requirements.txt, and host.json. See documentation for the expected structure.">
 <IconButton size="small">
   <HelpOutlineIcon fontSize="small" />
 </IconButton>
</Tooltip>
```


### Task 4.4: Deployment Status Page (Optional Enhancement)


**Action:** Add a deployment status view in the plugin details page.


**Add to plugin detail view:**


```jsx
{plugin.deploymentType === "managed" && (
 <Card sx={{ mb: 2 }}>
   <CardContent>
     <Typography variant="h6" gutterBottom>
       Deployment Status
     </Typography>
     <DeploymentStatusWidget
       pluginId={plugin._id}
       functionAppName={plugin.functionAppName}
     />
   </CardContent>
 </Card>
)}
```


---


## 6. Validation Checklist


### Pre-Implementation Checklist


- [ ] Azure subscription with contributor access
- [ ] Azure CLI installed and configured
- [ ] Service Principal created for automated deployments
- [ ] Storage Account created for function app files
- [ ] Application Insights resource created
- [ ] Environment variables configured in `.env`
- [ ] NPM packages installed in backend


### Post-Implementation Checklist


#### Backend Validation
- [ ] `npm run dev` starts without errors
- [ ] `POST /api/deploy/validate` returns 401 without auth
- [ ] `POST /api/deploy/validate` with auth and valid zip returns 200
- [ ] `POST /api/deploy/validate` with invalid zip returns 400 with errors
- [ ] `POST /api/deploy/:pluginId` creates function app in Azure
- [ ] `GET /api/deploy/:pluginId/status` returns correct status
- [ ] `DELETE /api/deploy/:pluginId` removes function app
- [ ] Plugin model includes new fields
- [ ] Plugin creates successfully with `deploymentType: "managed"`


#### Frontend Validation
- [ ] `npm start` compiles without errors
- [ ] Create wizard shows 5 steps (was 4)
- [ ] Deployment mode selector renders correctly
- [ ] External mode allows proceeding without upload
- [ ] Managed mode requires valid zip before proceeding
- [ ] File drag-and-drop works
- [ ] Validation results display correctly
- [ ] Review page shows deployment info
- [ ] Submit button shows loading state
- [ ] Success toast appears after deployment
- [ ] Error handling displays user-friendly messages


#### Integration Validation
- [ ] Full external flow works end-to-end
- [ ] Full managed flow works end-to-end
- [ ] Deployed function responds to HTTP requests
- [ ] Plugin URL is correctly set after deployment
- [ ] Plugin can be deleted (includes Azure cleanup)


---


## 7. Troubleshooting


### Common Issues and Solutions


#### Issue: "Azure credentials not configured"


**Symptom:** Deployment fails with authentication error


**Solution:**
1. Verify environment variables are set:
  ```bash
  echo $AZURE_TENANT_ID
  echo $AZURE_CLIENT_ID
  echo $AZURE_CLIENT_SECRET
  echo $AZURE_SUBSCRIPTION_ID
  ```
2. Test Azure CLI login:
  ```bash
  az login --service-principal \
   -u $AZURE_CLIENT_ID \
   -p $AZURE_CLIENT_SECRET \
   --tenant $AZURE_TENANT_ID
  ```
3. Verify service principal has Contributor role on subscription


#### Issue: "Resource group not found"


**Symptom:** 404 error when deploying


**Solution:**
1. Create resource group:
  ```bash
  az group create --name lumina-deployments-rg --location southeastasia
  ```
2. Verify `AZURE_RESOURCE_GROUP` matches exactly


#### Issue: "Storage account not found"


**Symptom:** Function app creation fails


**Solution:**
1. Create storage account:
  ```bash
  az storage account create \
   --name luminadeploymentstorage \
   --resource-group lumina-deployments-rg \
   --location southeastasia \
   --sku Standard_LRS
  ```
2. Verify `AZURE_STORAGE_ACCOUNT` matches exactly


#### Issue: "Zip validation fails unexpectedly"


**Symptom:** Valid zip shows as invalid


**Solution:**
1. Check zip was created from correct directory level
2. Verify files are at root of zip, not in subdirectory:
  ```bash
  unzip -l your-function.zip
  # Should show:
  #   function_app.py
  #   requirements.txt
  #   host.json
  # NOT:
  #   subfolder/function_app.py
  ```
3. Recreate zip from within the function directory


#### Issue: "Deployment times out"


**Symptom:** 5-minute timeout during deployment


**Solution:**
1. Check if function app was partially created in Azure Portal
2. Delete partial resources and retry
3. Increase timeout in `deploymentService.js`:
  ```javascript
  timeout: 600000 // 10 minutes
  ```
4. Check Azure status page for service issues


#### Issue: "CORS errors when calling deployed function"


**Symptom:** Browser blocks requests to function URL


**Solution:**
1. Add CORS settings in Azure Portal → Function App → CORS
2. Or add to deployment code:
  ```javascript
  // In deployFunctionApp, add to siteConfig:
  cors: {
   allowedOrigins: ["*"], // Or specific origins
   supportCredentials: false
  }
  ```


#### Issue: "Function responds with 500 error"


**Symptom:** Deployment succeeds but function fails


**Solution:**
1. Check Application Insights for error logs
2. Verify `requirements.txt` includes all dependencies
3. Test function locally first:
  ```bash
  func start
  ```
4. Check Python version compatibility (should be 3.11)


### Debug Mode


Enable verbose logging in development:


```javascript
// In deploymentService.js
const DEBUG = process.env.NODE_ENV === "development";


if (DEBUG) {
 console.log("Deployment request:", {
   functionAppName,
   zipSize: zipBuffer.length,
   options
 });
}
```


---


## 8. API Reference


### Deployment Endpoints


#### Validate Zip Structure


```
POST /api/deploy/validate
Authorization: Bearer <token>
Content-Type: multipart/form-data


Body:
 zipFile: <binary>


Response 200:
{
 "success": true,
 "errors": [],
 "warnings": ["local.settings.json found - will be ignored"],
 "fileCount": 5
}


Response 400:
{
 "success": false,
 "errors": ["Missing required file: function_app.py"],
 "warnings": [],
 "fileCount": 2
}
```


#### Deploy Plugin


```
POST /api/deploy/:pluginId
Authorization: Bearer <token>
Content-Type: multipart/form-data


Body:
 zipFile: <binary>


Response 200:
{
 "success": true,
 "message": "Deployment successful",
 "functionAppName": "lumina-abc12345-xyz789",
 "functionUrl": "https://lumina-abc12345-xyz789.azurewebsites.net",
 "warnings": []
}


Response 400:
{
 "success": false,
 "error": "Invalid zip structure",
 "details": ["Missing required file: requirements.txt"]
}


Response 500:
{
 "success": false,
 "error": "Deployment failed",
 "details": "Azure error message"
}
```


#### Get Deployment Status


```
GET /api/deploy/:pluginId/status
Authorization: Bearer <token>


Response 200 (managed):
{
 "success": true,
 "deploymentType": "managed",
 "managed": true,
 "functionAppName": "lumina-abc12345-xyz789",
 "exists": true,
 "state": "Running",
 "url": "https://lumina-abc12345-xyz789.azurewebsites.net",
 "lastModified": "2024-01-15T10:30:00Z"
}


Response 200 (external):
{
 "success": true,
 "deploymentType": "external",
 "managed": false
}
```


#### Delete Deployment


```
DELETE /api/deploy/:pluginId
Authorization: Bearer <token>


Response 200:
{
 "success": true,
 "message": "Deployment deleted successfully"
}


Response 400:
{
 "success": false,
 "error": "No managed deployment found for this plugin"
}
```


---


## 9. File Summary


### New Files to Create


| File Path | Type | Description |
|-----------|------|-------------|
| `Lumina/lumina-web-be/services/deploymentService.js` | Backend | Core Azure deployment logic |
| `Lumina/lumina-web-be/controllers/deploy.controller.js` | Backend | HTTP request handlers |
| `Lumina/lumina-web-be/routes/deploy.route.js` | Backend | Route definitions |
| `Lumina/lumina-web-fe/src/components/create/DeploymentModeSelector.jsx` | Frontend | Mode selection UI |
| `Lumina/lumina-web-fe/src/components/create/DeploymentErrorBoundary.jsx` | Frontend | Error handling |


### Files to Modify


| File Path | Changes |
|-----------|---------|
| `Lumina/lumina-web-be/models/plugin.model.js` | Add `deploymentType` and `functionAppName` fields |
| `Lumina/lumina-web-be/index.js` | Register deploy routes |
| `Lumina/lumina-web-fe/src/screens/developer/create/Create.jsx` | Add deployment step and handlers |
| `Lumina/lumina-web-fe/src/components/create/ReviewForm.jsx` | Display deployment info |


---


*Document Version: 1.0*
*Last Updated: January 2025*
*Maintainer: Lumina Development Team*



