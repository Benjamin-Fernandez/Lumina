/**
* Deployment Service
* Handles zip validation and Azure Function deployment
* Ported from: chatbot-middleware/mkiats-dev-deployment/azureFunctionDeployerClient.py
*/


const { DefaultAzureCredential } = require("@azure/identity");
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
  * Uses DefaultAzureCredential which supports:
  * - Managed Identity (when running in Azure App Service)
  * - Azure CLI credentials (when running locally)
  * - Environment variables (AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID) if set
  */
 async initialize() {
   this.credential = new DefaultAzureCredential();


   this.webClient = new WebSiteManagementClient(
     this.credential,
     this.subscriptionId
   );


   this.storageClient = new StorageManagementClient(
     this.credential,
     this.subscriptionId
   );
 }


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
     await this.webClient.webApps.beginCreateOrUpdateAndWait(
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


     // Deploy zip package using Kudu API with Bearer token
     console.log(`Deploying code to: ${functionAppName}`);


     // Wait for function app to be fully ready
     console.log(`Waiting for function app to be ready...`);
     await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds for app to initialize


     // Get Bearer token for SCM site (same scope as ARM)
     const tokenResponse = await this.credential.getToken("https://management.azure.com/.default");
     console.log(`Bearer token retrieved: ${tokenResponse?.token ? 'yes' : 'no'}`);


     // Use Kudu API with Bearer token authentication
     const kuduUrl = `https://${functionAppName}.scm.azurewebsites.net/api/zipdeploy?isAsync=false`;
     console.log(`Kudu URL: ${kuduUrl}`);


     const axios = require("axios");
     const deployResponse = await axios.post(kuduUrl, zipBuffer, {
       headers: {
         "Authorization": `Bearer ${tokenResponse.token}`,
         "Content-Type": "application/zip"
       },
       maxContentLength: Infinity,
       maxBodyLength: Infinity,
       timeout: 300000 // 5 minute timeout for large deployments
     });


     console.log(`Deployment response status: ${deployResponse.status}`);


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




