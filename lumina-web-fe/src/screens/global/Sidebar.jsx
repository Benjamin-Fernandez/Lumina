import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AllInboxOutlinedIcon from "@mui/icons-material/AllInboxOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.background[600],
        marginBottom: "10px",
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography variant="h5">{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const path = location.pathname;
  const [collapsed, setCollapsed] = useState(false); // keep state of sidebar collapse
  const [selected, setSelected] = useState("Dashboard"); // keep state of selected menu item

  useEffect(() => {
    if (path.includes("/dashboard")) {
      setSelected("Dashboard");
    } else if (path.includes("/plugin")) {
      setSelected("Plugin");
    } else if (path.includes("/request")) {
      setSelected("Request");
    } else if (path.includes("/contributor")) {
      setSelected("Contributor");
    } else if (path.includes("/setting")) {
      setSelected("Setting");
    } else if (path.includes("/profile")) {
      setSelected("Profile");
    } else if (path.includes("/notification")) {
      setSelected("Notification");
    }
  }, [path]);

  return (
    <Box
      sx={
        // use important to override the default styles
        // try not to use important tags, but in this case, it is necessary to override a library's default styles
        {
          "& .pro-sidebar-inner": {
            background: `${colors.background[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }
      }
    >
      <ProSidebar collapsed={collapsed}>
        <Menu iconShape="square">
          {/* Logo and Menu Icon*/}
          <MenuItem
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuOutlinedIcon fontSize="large" /> : undefined}
            style={{
              margin: "20px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Box display="flex" alignItems="center">
                  <img
                    src="../../assets/logo.png"
                    alt="logo"
                    width="30px"
                    height="30px"
                    style={{ marginRight: "10px" }}
                  />
                  <Typography
                    variant="h4"
                    style={{ color: colors.background[100] }}
                  >
                    Lumina
                  </Typography>
                </Box>
                <IconButton onCluck={() => setCollapsed(!collapsed)}>
                  <MenuOutlinedIcon fontSize="large" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* Menu Items */}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<WidgetsOutlinedIcon fontSize="large" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Plugin"
              to="/plugin"
              icon={<ExtensionOutlinedIcon fontSize="large" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Request"
              to="/request"
              icon={<AllInboxOutlinedIcon fontSize="large" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Contributor"
              to="/contributor"
              icon={<PeopleOutlineOutlinedIcon fontSize="large" />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Setting"
              to="/setting"
              icon={<SettingsOutlinedIcon fontSize="large" />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
