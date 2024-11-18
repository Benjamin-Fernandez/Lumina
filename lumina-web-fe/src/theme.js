import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// colors
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#A9A9A9",
          900: "#A9A9A9",
        },
        background: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },

        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
        yellowAccent: {
          100: "#fff0cc",
          200: "#ffe199",
          300: "#ffd166",
          400: "#ffc233",
          500: "#ffb300",
          600: "#cc8f00",
          700: "#996b00",
          800: "#664800",
          900: "#332400",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        secondary: {
          100: "#ececee",
          200: "#dad9dc",
          300: "#c7c7cb",
          400: "#b5b4b9",
          500: "#a2a1a8",
          600: "#828186",
          700: "#616165",
          800: "#414043",
          900: "#202022",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        background: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // manually changed
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
        yellowAccent: {
          100: "#332400",
          200: "#664800",
          300: "#996b00",
          400: "#cc8f00",
          500: "#ffb300",
          600: "#ffc233",
          700: "#ffd166",
          800: "#ffe199",
          900: "#fff0cc",
        },
        secondary: {
          100: "#202022",
          200: "#414043",
          300: "#616165",
          400: "#828186",
          500: "#a2a1a8",
          600: "#b5b4b9",
          700: "#c7c7cb",
          800: "#dad9dc",
          900: "#ececee",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode); // retrieve colors based on mode
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.background[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.background[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.background[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Lexend", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Lexend", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Lexend", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Lexend", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Lexend", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Lexend", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Lexend", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // give easy access to the current mode and the ability to toggle it
  const [mode, setMode] = useState("light"); // state that stores the current mode
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  // creating theme from mui, passing in the mode, giving us the object of the proper formats

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // create theme based on light mode

  return [theme, colorMode];
};
