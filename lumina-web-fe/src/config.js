import { PublicClientApplication } from "@azure/msal-browser";


// ⚠️ CONFIGURATION - UPDATE THESE VALUES
// ===========================================


// Azure AD App Registration Settings
export const authConfig = {
 // Get this from Azure Portal → App registrations → Application (client) ID
 clientId: "d6a126c8-d974-4272-9209-f7fc66d9fb5f", // ⚠️ UPDATE THIS


 // Get this from Azure Portal → App registrations → Directory (tenant) ID
 tenantId: "0f8289d7-df22-4c3e-89b7-0fb1bcea61ab", // ⚠️ UPDATE THIS (or use "common" for multi-tenant)


 // Authority URL
 // Option 1: Multi-tenant (any Microsoft account) - RECOMMENDED
 authority: "https://login.microsoftonline.com/common",


 // Option 2: Single-tenant (only your organization)
 // authority: "https://login.microsoftonline.com/0f8289d7-df22-4c3e-89b7-0fb1bcea61ab",


 // Redirect URIs
 // Production: Your deployed Azure Static Web App URL
 redirectUri: "https://ashy-moss-01833a500.3.azurestaticapps.net", // ⚠️ UPDATE THIS


 // Local development: Uncomment when testing locally
 // redirectUri: "http://localhost:3000",


 // Scopes (permissions your app needs)
 scopes: ["user.read"],
};


// Backend API Configuration
export const apiConfig = {
 // Production backend
 baseURL: "https://lumina-web-be-deh3gwc0fre2hjgz.southeastasia-01.azurewebsites.net", // ⚠️ UPDATE THIS


 // Local development backend (uncomment when running backend locally)
 // baseURL: "http://localhost:8080",
};


// ===========================================
// MSAL Configuration (uses authConfig above)
// ===========================================


export const config = {
 appId: authConfig.clientId,
 redirectUri: authConfig.redirectUri,
 scopes: authConfig.scopes,
 authority: authConfig.authority,
};


export const msalConfig = {
 auth: {
   clientId: authConfig.clientId,
   authority: authConfig.authority,
   redirectUri: authConfig.redirectUri,
 },
 cache: {
   cacheLocation: "sessionStorage",
   storeAuthStateInCookie: false,
 },
};


export const msalInstance = new PublicClientApplication(msalConfig);


export const loginRequest = {
 scopes: authConfig.scopes,
};




