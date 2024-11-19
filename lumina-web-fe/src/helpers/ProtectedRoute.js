// ProtectedRoute.js
import { useMsal } from "@azure/msal-react";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated
  const { instance } = useMsal();
  console.log("Active Account: ", instance.getActiveAccount());
  const isAuthenticated = instance.getActiveAccount() !== null;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
