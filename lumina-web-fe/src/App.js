import { ColorModeContext, useMode } from "./theme";
// CssBaseline --> resets the css to the default
// ThemeProvider --> let us pass the themes into mui
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./screens/global/Topbar";
import Sidebar from "./screens/global/Sidebar";
import Login from "./screens/auth/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import Plugin from "./screens/plugin/Plugin";
import PluginDetails from "./screens/plugin/PluginDetails";
import Request from "./screens/request/Request";
import RequestDetails from "./screens/request/RequestDetails";
import Contributor from "./screens/contributor/Contributor";
import ContributorDetails from "./screens/contributor/ContributorDetails";
import ContributorForm from "./screens/contributor/ContributorForm";
import Notification from "./screens/notification/Notification";
import Profile from "./screens/profile/Profile";
import NotFound from "./screens/NotFound";
import ProtectedRoute from "./helpers/ProtectedRoute";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../src/config";

// import Setting from "./screens/setting";

function App() {
  const [themeMode, colorMode] = useMode();
  const location = useLocation();
  const BarPresent =
    location.pathname === "/dashboard" ||
    location.pathname.match("^/plugin/([a-zA-Z0-9]+)$") ||
    location.pathname.match("^/request/([a-zA-Z0-9]+)$") ||
    location.pathname.match("^/contributor/([a-zA-Z0-9]+)$") ||
    location.pathname === "/plugin" ||
    location.pathname === "/request" ||
    location.pathname === "/contributor" ||
    location.pathname === "/contributorform" ||
    location.pathname === "/notification" ||
    location.pathname === "/profile";
  return (
    <MsalProvider instance={msalInstance}>
      <ColorModeContext.Provider value={colorMode}>
        {/* Setting up the theme provider */}
        <ThemeProvider theme={themeMode}>
          {/* CssBaseline --> resets the css to the default [FROM MUI] */}
          <CssBaseline />
          <div className="app">
            {/* Sidebar */}
            {BarPresent && <Sidebar />}
            {/* Main content */}
            <main className="content">
              {/* Topbar */}
              {BarPresent && <Topbar />}
              {/* Routes */}
              <Routes>
                <Route path="/" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/plugin"
                  element={
                    <ProtectedRoute>
                      <Plugin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/plugin/:id"
                  element={
                    <ProtectedRoute>
                      <PluginDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/request"
                  element={
                    <ProtectedRoute>
                      <Request />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/request/:id"
                  element={
                    <ProtectedRoute>
                      <RequestDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contributor"
                  element={
                    <ProtectedRoute>
                      <Contributor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contributor/:id"
                  element={
                    <ProtectedRoute>
                      <ContributorDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contributorform"
                  element={
                    <ProtectedRoute>
                      <ContributorForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notification"
                  element={
                    <ProtectedRoute>
                      <Notification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </MsalProvider>
  );
}

export default App;
