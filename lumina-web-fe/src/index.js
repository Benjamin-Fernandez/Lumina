import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// index.js;
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { MsalProvider } from "@azure/msal-react";
// import { PublicClientApplication } from "@azure/msal-browser";

// const msalConfig = {
//   auth: {
//     clientId: "d6a126c8-d974-4272-9209-f7fc66d9fb5f",
//     authority: "",
//     redirectUri: "http://localhost:3000",
//   },
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// const App = () => <h1>MSAL Test App</h1>;

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <MsalProvider instance={msalInstance}>
//     <App />
//   </MsalProvider>
// );
