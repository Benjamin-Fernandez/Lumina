import { ColorModeContext, useMode } from "./theme";
// CssBaseline --> resets the css to the default
// ThemeProvider --> let us pass the themes into mui
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./screens/global/Topbar";
import Sidebar from "./screens/global/Sidebar";
import Login from "./screens/global/auth/Login";
// import Request from "./screens/admin/request/Request";
// import RequestDetails from "./screens/admin/request/RequestDetails";
// import Contributor from "./screens/admin/contributor/Contributor";
// import ContributorDetails from "./screens/admin/contributor/ContributorDetails";
// import ContributorForm from "./screens/admin/contributor/ContributorForm";
import Notification from "./screens/global/notification/Notification";
import Profile from "./screens/global/profile/Profile";
import NotFound from "./screens/global/NotFound";
import ProtectedRoute from "./helpers/ProtectedRoute";
import Create from "./screens/developer/create/Create";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../src/config";
import PluginDev from "./screens/developer/plugin/PluginDev";
import PluginDetailsDev from "./screens/developer/plugin/PluginDetailsDev";

// import Setting from "./screens/setting";

function App() {
  const [themeMode, colorMode] = useMode();
  const location = useLocation();
  const BarPresent =
    // location.pathname === "/dashboard" ||
    // location.pathname.match("^/plugin/([a-zA-Z0-9]+)$") ||
    // location.pathname.match("^/request/([a-zA-Z0-9]+)$") ||
    // location.pathname.match("^/contributor/([a-zA-Z0-9]+)$") ||
    // location.pathname === "/plugin" ||
    // location.pathname === "/request" ||
    // location.pathname === "/contributor" ||
    // location.pathname === "/contributorform" ||
    // location.pathname === "/notification" ||
    location.pathname === "/profile" ||
    location.pathname === "/pluginDev" ||
    location.pathname.match("^/pluginDev/([a-zA-Z0-9]+)$") ||
    location.pathname === "/create";
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
                {/* <Route
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
                      <PluginAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/plugin/:id"
                  element={
                    <ProtectedRoute>
                      <PluginDetailsAdmin />
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
                /> */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <Create />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pluginDev"
                  element={
                    <ProtectedRoute>
                      <PluginDev />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pluginDev/:id"
                  element={
                    <ProtectedRoute>
                      <PluginDetailsDev />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <NotFound />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </MsalProvider>
  );
}

export default App;
