import { ColorModeContext, useMode } from "./theme";
// CssBaseline --> resets the css to the default
// ThemeProvider --> let us pass the themes into mui
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./screens/global/Topbar";
import Sidebar from "./screens/global/Sidebar";
import Dashboard from "./screens/dashboard";
// import Plugin from "./screens/global/plugin";
// import Request from "./screens/global/request";
// import Contributor from "./screens/global/contributor";
// import Setting from "./screens/global/setting";

function App() {
  const [themeMode, colorMode] = useMode();
  return (
    /* Setting up the color context */
    <ColorModeContext.Provider value={colorMode}>
      {/* Setting up the theme provider */}
      <ThemeProvider theme={themeMode}>
        {/* CssBaseline --> resets the css to the default [FROM MUI] */}
        <CssBaseline />
        <div className="app">
          {/* Sidebar */}
          <Sidebar />
          {/* Main content */}
          <main className="content">
            {/* Topbar */}
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/plugin" element={<Plugin />} /> */}
              {/* <Route path="/request" element={<Request />} /> */}
              {/* <Route path="/contributor" element={<Contributor />} /> */}
              {/* <Route path="/setting" element={<Setting />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
