import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

// colors
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        background: {
          100: "#fcfcfc",
          200: "#f9f9f9",
          300: "#f6f6f6",
          400: "#f3f3f3",
          500: "#f0f0f0",
          600: "#c0c0c0",
          700: "#909090",
          800: "#606060",
          900: "#303030",
        },
        blueAccent: {
          100: "#ccdaf0",
          200: "#99b5e2",
          300: "#6691d3",
          400: "#336cc5",
          500: "#0047b6",
          600: "#003992",
          700: "#002b6d",
          800: "#001c49",
          900: "#000e24",
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
          100: "#f7d2d4",
          200: "#efa5aa",
          300: "#e8797f",
          400: "#e04c55",
          500: "#d81f2a",
          600: "#ad1922",
          700: "#821319",
          800: "#560c11",
          900: "#2b0608",
        },
        greenAccent: {
          100: "#d6f2e6",
          200: "#ace5cd",
          300: "#83d8b4",
          400: "#59cb9b",
          500: "#30be82",
          600: "#269868",
          700: "#1d724e",
          800: "#134c34",
          900: "#0a261a",
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
        background: {
          100: "#303030",
          200: "#606060",
          300: "#909090",
          400: "#c0c0c0",
          500: "#f0f0f0",
          600: "#f3f3f3",
          700: "#f6f6f6",
          800: "#f9f9f9",
          900: "#fcfcfc",
        },
        blueAccent: {
          100: "#000e24",
          200: "#001c49",
          300: "#002b6d",
          400: "#003992",
          500: "#0047b6",
          600: "#336cc5",
          700: "#6691d3",
          800: "#99b5e2",
          900: "#ccdaf0",
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
        redAccent: {
          100: "#2b0608",
          200: "#560c11",
          300: "#821319",
          400: "#ad1922",
          500: "#d81f2a",
          600: "#e04c55",
          700: "#e8797f",
          800: "#efa5aa",
          900: "#f7d2d4",
        },
        greenAccent: {
          100: "#0a261a",
          200: "#134c34",
          300: "#1d724e",
          400: "#269868",
          500: "#30be82",
          600: "#59cb9b",
          700: "#83d8b4",
          800: "#ace5cd",
          900: "#d6f2e6",
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
            primary: {
              main: colors.background[500],
            },
            blue: {
              main: colors.blueAccent[500],
            },
            yellow: {
              main: colors.yellowAccent[500],
            },
            red: {
              main: colors.redAccent[500],
            },
            green: {
              main: colors.greenAccent[500],
            },
            background: {
              default: colors.background[900],
            },
            secondary: {
              dark: colors.secondary[900],
              main: colors.secondary[500],
            },
          }
        : {
            primary: {
              main: colors.background[500],
            },
            blue: {
              main: colors.blueAccent[500],
            },
            yellow: {
              main: colors.yellowAccent[500],
            },
            red: {
              main: colors.redAccent[500],
            },
            green: {
              main: colors.greenAccent[500],
            },
            background: {
              default: colors.background[500],
            },
            secondary: {
              dark: colors.secondary[900],
              main: colors.secondary[500],
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
