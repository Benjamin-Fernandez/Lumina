import { Box, Icon, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Left side of the topbar */}
      <Box display="flex">Screen Title</Box>
      {/* Right side of the topbar */}
      <Box display="flex">
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <Box display="flex">
            <Box display="flex-column">Username Role</Box>
            <KeyboardArrowDownIcon />
          </Box>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
