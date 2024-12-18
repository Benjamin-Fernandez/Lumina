import { PublicClientApplication } from "@azure/msal-browser";

export const config = {
  appId: "d6a126c8-d974-4272-9209-f7fc66d9fb5f",
  redirectUri: "https://witty-bay-0d4b3dd10.4.azurestaticapps.net/",
  scopes: ["user.read"],
  authority: "", // only needed for single-tenant, for you to input your tenant
};

export const msalConfig = {
  auth: {
    clientId: "d6a126c8-d974-4272-9209-f7fc66d9fb5f",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://witty-bay-0d4b3dd10.4.azurestaticapps.net/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["user.read"],
};
