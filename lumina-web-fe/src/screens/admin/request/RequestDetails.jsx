import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../../theme";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ApproveUpdateModal from "../../../components/modal/ApproveUpdateModal";
import RejectModal from "../../../components/modal/RejectModal";
import RequestDetailTableSidebar from "../../../components/request/requestDetail/RequestDetailTableSidebar";
import RequestDetailTableContent from "../../../components/request/requestDetail/RequestDetailTableContent";

const RequestDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState("metadata");
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

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
  const handleOpenReject = () => {
    setRejectModal(true);
  };
  const handleCloseReject = () => {
    setRejectModal(false);
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
            variant="contained"
            color="error"
            sx={{
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              borderRadius: 2,
            }}
            onClick={handleOpenReject}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Reject
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" py={4}>
        <RequestDetailTableSidebar
          selectedSection={selectedSection}
          handleSectionClick={handleSectionClick}
        />
        <RequestDetailTableContent selectedSection={selectedSection} />
      </Box>
      <ApproveUpdateModal
        open={approveModal}
        handleClose={handleCloseApprove}
      />
      <RejectModal
        open={rejectModal}
        handleClose={handleCloseReject}
        email="LEEH0023@e.ntu.edu.sg"
      />
    </Box>
  );
};

export default RequestDetails;
