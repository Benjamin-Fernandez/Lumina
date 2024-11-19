import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../../theme";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PluginDetailTableSidebar from "../../../components/plugin/pluginDetail/PluginDetailTableSidebar";
import PluginDetailTableContent from "../../../components/plugin/pluginDetail/PluginDetailTableContent";
import DeactivateModal from "../../../components/modal/DeactivateModal";

const PluginDetailsAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState("metadata");
  const [deactivateModal, setDeactivateModal] = useState(false);

  // Function to handle sidebar navigation
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleOpenDeactivate = () => {
    setDeactivateModal(true);
  };
  const handleCloseDeactivate = () => {
    setDeactivateModal(false);
  };

  return (
    <Box
      px={4}
      mx={4}
      height="80vh"
      width="95%"
      border={1}
      borderRadius={2}
      borderColor={colors.grey[800]}
      display="flex"
      flexDirection="column"
    >
      <Box
        height="30%"
        width="100%"
        borderBottom={1}
        borderColor={colors.grey[800]}
        py={4}
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
            variant="contained"
            color="error"
            sx={{
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              borderRadius: 2,
            }}
            onClick={handleOpenDeactivate}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Deactivate
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" py={4}>
        <PluginDetailTableSidebar
          selectedSection={selectedSection}
          handleSectionClick={handleSectionClick}
        />
        <PluginDetailTableContent selectedSection={selectedSection} />
      </Box>
      <DeactivateModal
        open={deactivateModal}
        handleClose={handleCloseDeactivate}
      />
    </Box>
  );
};

export default PluginDetailsAdmin;
