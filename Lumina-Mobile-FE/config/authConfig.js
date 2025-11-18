// Authentication Configuration
// Update these values with your current Azure AD app registration details


export const authConfig = {
 // Azure AD Configuration
 clientId: "71519bba-3a1e-4a1c-9924-49754f9e992c", // ⚠️ UPDATE THIS - Get from Azure Portal → App registrations → Application (client) ID
 tenantId: "0f8289d7-df22-4c3e-89b7-0fb1bcea61ab", // ⚠️ UPDATE THIS - Get from Azure Portal → App registrations → Directory (tenant) ID

  // Authority URL
 // Use "common" for multi-tenant (any Microsoft account)
 // Use specific tenant ID for single-tenant (organization only)
//  authority: "https://login.microsoftonline.com/eb5a9f14-35b1-491a-8e43-fd42a0b8a540/v2.0", // ⚠️ UPDATE THIS
 authority: "https://login.microsoftonline.com/common/v2.0", // ⚠️ UPDATE THIS

  // Scopes - permissions your app needs
 scopes: ["openid", "profile", "email", "User.Read"],

  // Redirect URI scheme (from app.json)
 redirectScheme: "com.lumina",
};


// Backend API Configuration
export const apiConfig = {
 baseURL: "https://lumina-mobile-be-cahcaybjbbhxdzf4.southeastasia-01.azurewebsites.net", // ⚠️ UPDATE THIS if backend URL changed
};







