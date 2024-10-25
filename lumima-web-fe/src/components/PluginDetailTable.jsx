import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../theme";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PluginDetailTableSidebar from "./PluginDetailTableSidebar";
import PluginDetailTableContent from "./PluginDetailTableContent";

const PluginDetailTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState("metadata");

  // Function to handle sidebar navigation
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <Box
      py={4}
      px={4}
      mx={4}
      height="80%"
      width="95%"
      border={1}
      borderRadius={2}
      borderColor={colors.grey[800]}
      display="flex"
      flexDirection="column"
    >
      <Box
        height="20%"
        width="100%"
        borderBottom={1}
        borderColor={colors.grey[800]}
        pb={4}
        mb={4}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="row">
          <Box
            component="img"
            src={"/assets/chatbot.jpg"}
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
            }}
          />
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h4"
              sx={{ mx: "20px", my: "20px" }}
              fontWeight="bold"
            >
              Plugin Name
            </Typography>
            <Typography variant="h6" sx={{ mx: "20px", mb: "10px" }}>
              Author
            </Typography>
            <Typography variant="h6" sx={{ mx: "20px" }}>
              Author Email
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <Button
            sx={{
              bgcolor: colors.blueAccent[500],
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              color: "white",
              mr: 2,
              borderRadius: 2,
            }}
            startIcon={<TaskAltOutlinedIcon />}
          >
            Approve
          </Button>
          <Button
            sx={{
              bgcolor: colors.yellowAccent[500],
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              color: "white",
              mr: 2,
              borderRadius: 2,
            }}
            startIcon={<AddCommentOutlinedIcon />}
          >
            Follow-up
          </Button>
          <Button
            sx={{
              bgcolor: colors.redAccent[500],
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              color: "white",
              borderRadius: 2,
            }}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Deactivate
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
        <PluginDetailTableSidebar
          selectedSection={selectedSection}
          handleSectionClick={handleSectionClick}
        />
        <PluginDetailTableContent selectedSection={selectedSection} />
      </Box>
    </Box>
  );
};

export default PluginDetailTable;
