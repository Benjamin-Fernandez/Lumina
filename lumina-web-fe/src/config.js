import { PublicClientApplication } from "@azure/msal-browser";


// ⚠️ CONFIGURATION - UPDATE THESE VALUES
// ===========================================


// Azure AD App Registration Settings
export const authConfig = {
 // Get this from Azure Portal → App registrations → Application (client) ID
 clientId: "3c79dd79-7c34-4cda-9973-25849a553f51", // Updated - Ben

 // Get this from Azure Portal → App registrations → Directory (tenant) ID
 tenantId: "0f8289d7-df22-4c3e-89b7-0fb1bcea61ab", // Updated - Ben

 // Authority URL
 // Multi-tenant (any Microsoft account)
 authority: "https://login.microsoftonline.com/common",

 // Redirect URIs
 // Production: Your deployed Azure Static Web App URL
 redirectUri: "https://ashy-moss-01833a500.3.azurestaticapps.net", // Updated - Ben

 // Local development: Uncomment when testing locally
 // redirectUri: "http://localhost:3000",

 // Scopes (permissions app needs)
 scopes: [
  "User.Read",
  "openid",
  "email",
  "profile"
 ],
};


// Backend API Configuration
export const apiConfig = {
 // Production backend
 baseURL: "https://lumina-web-be-deh3gwc0fre2hjgz.southeastasia-01.azurewebsites.net", // Updated - Ben


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




