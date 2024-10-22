import {
  Box,
  IconButton,
  useTheme,
  Button,
  Icon,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FaceIcon from "@mui/icons-material/Face";

const Topbar = () => {
  const theme = useTheme();
  /* anytime we want to use the colour mode in MUI, 
    we can grab it from MUI and pass to the tokens function
    */
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Box components allows you to write CSS properties on the component
  // Other components you need to use sx prop
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={4}
    >
      {/* Left side of the topbar */}
      <Box>
        <Box display="flex" sx={{ fontSize: "20px" }}>
          Screen Title
        </Box>
      </Box>
      {/* Right side of the topbar */}
      <Box display="flex" gap="5px">
        <IconButton>
          <NotificationsOutlinedIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon fontSize="large" />
          ) : (
            <DarkModeOutlinedIcon fontSize="large" />
          )}
        </IconButton>
        <IconButton>
          <FaceIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
