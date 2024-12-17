import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FaceIcon from "@mui/icons-material/Face";
import { Link, useLocation } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  /* anytime we want to use the colour mode in MUI,
    we can grab it from MUI and pass to the tokens function
    */
  // const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  const path = location.pathname;
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // if (path.includes("/dashboard")) {
    //   setSelected("Dashboard");
    // } else
    if (path.includes("/pluginDev")) {
      setSelected("Plugin");
    }
    // else if (path.includes("/request")) {
    //   setSelected("Request");
    // }
    else if (path.includes("/create")) {
      setSelected("Create");
    }
    // else if (path.includes("/contributor")) {
    //   setSelected("Contributor");
    // }
    // else if (path.includes("/setting")) {
    //   setSelected("Setting");
    // }
    else if (path.includes("/profile")) {
      setSelected("Profile");
    } else if (path.includes("/notification")) {
      setSelected("Notification");
    }
  }, [path]);

  // Box components allows you to write CSS properties on the component
  // Other components you need to use sx prop
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={4}
    >
      <Box>
        <Box display="flex" sx={{ fontSize: "20px" }}>
          {path.includes("/dashboard") ? (
            <Typography variant="h4">Dashboard</Typography>
          ) : path.includes("/contributor") ? (
            <Typography variant="h4">Contributors</Typography>
          ) : path.includes("/notification") ? (
            <Typography variant="h4">Notifications</Typography>
          ) : path.includes("/request") ? (
            <Typography variant="h4">Requests</Typography>
          ) : path.includes("/profile") ? (
            <Typography variant="h4">Profile</Typography>
          ) : path.includes("/create") ? (
            <Typography variant="h4">Create New Plugin</Typography>
          ) : (
            <Typography variant="h4">Plugins</Typography>
          )}
        </Box>
      </Box>
      {/* Right side of the topbar */}
      <Box display="flex" gap="5px">
        {/* <Link to="/notification">
          <IconButton>
            <NotificationsOutlinedIcon
              fontSize="large"
              sx={{
                color: selected === "Notification" ? "#6870fa" : "inherit",
              }}
            />
          </IconButton>
        </Link> */}
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon fontSize="large" />
          ) : (
            <DarkModeOutlinedIcon fontSize="large" />
          )}
        </IconButton> */}
        <Link to="/profile">
          <IconButton>
            <FaceIcon
              fontSize="large"
              sx={{
                color: selected === "Profile" ? "#6870fa" : "inherit",
              }}
            />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default Topbar;
