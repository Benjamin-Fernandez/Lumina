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
    /* Setting up the color context */
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
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plugin" element={<Plugin />} />
              <Route path="/plugin/:id" element={<PluginDetails />} />
              <Route path="/request" element={<Request />} />
              <Route path="/request/:id" element={<RequestDetails />} />
              <Route path="/contributor" element={<Contributor />} />
              <Route path="/contributor/:id" element={<ContributorDetails />} />
              <Route path="/contributorform" element={<ContributorForm />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
              {/* <Route path="/setting" element={<Setting />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
