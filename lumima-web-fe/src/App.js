import { ColorModeContext, useMode } from "./theme";
// CssBaseline --> resets the css to the default
// ThemeProvider --> let us pass the themes into mui
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./screens/global/Topbar";
import Sidebar from "./screens/global/Sidebar";

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
          <main className="content">
            {/* Topbar */}
            <Topbar />
            {/* Sidebar */}
            <Sidebar />
            {/* Main content */}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
