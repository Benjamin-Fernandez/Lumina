import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.background[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [collapsed, setCollapsed] = useState(false); // keep state of sidebar collapse
  const [selected, setSelected] = useState("Dashboard"); // keep state of selected menu item

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
            icon={collapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
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
                    width="25px"
                    height="25px"
                    style={{ marginRight: "10px" }}
                  />
                  <Typography
                    variant="h5"
                    style={{ color: colors.background[100] }}
                  >
                    Lumina
                  </Typography>
                </Box>
                <IconButton onCluck={() => setCollapsed(!collapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!collapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src="../../assets/user.png"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0 " }}
                >
                  Username
                </Typography>
                <Typography variant="h5" color={colors.blueAccent[500]}>
                  User Role
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<WidgetsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Plugin"
              to="/plugin"
              icon={<ExtensionOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Request"
              to="/request"
              icon={<ConfirmationNumberOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Contributor"
              to="/contributor"
              icon={<PeopleOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Setting"
              to="/setting"
              icon={<SettingsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
