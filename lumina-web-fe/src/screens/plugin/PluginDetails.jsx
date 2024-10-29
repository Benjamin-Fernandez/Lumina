import { useParams } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PluginDetailTableSidebar from "../../components/plugin/pluginDetail/PluginDetailTableSidebar";
import PluginDetailTableContent from "../../components/plugin/pluginDetail/PluginDetailTableContent";
import ApproveUpdateModal from "../../components/modal/ApproveUpdateModal";
import FollowupModal from "../../components/modal/FollowupModal";
import DeactivateModal from "../../components/modal/DeactivateModal";

const PluginDetails = () => {
  const { id } = useParams();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState("metadata");
  const [approveModal, setApproveModal] = useState(false);
  const [followUpModal, setFollowUpModal] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);

  // Function to handle sidebar navigation
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleOpenApprove = () => {
    setApproveModal(true);
  };
  const handleCloseApprove = () => {
    setApproveModal(false);
  };
  const handleOpenFollowUp = () => {
    setFollowUpModal(true);
  };
  const handleCloseFollowUp = () => {
    setFollowUpModal(false);
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
            onClick={handleOpenApprove}
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
            onClick={handleOpenFollowUp}
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
      <ApproveUpdateModal
        open={approveModal}
        handleClose={handleCloseApprove}
      />
      <FollowupModal
        open={followUpModal}
        handleClose={handleCloseFollowUp}
        email="LEEH0023@e.ntu.edu.sg"
      />
      <DeactivateModal
        open={deactivateModal}
        handleClose={handleCloseDeactivate}
      />
    </Box>
  );
};

export default PluginDetails;
