import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../../theme";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import SwitchAccessShortcutOutlinedIcon from "@mui/icons-material/SwitchAccessShortcutOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContributorDetailTableContent from "../../../components/contributor/ContributorDetailTableContent";
import PromoteModal from "../../../components/modal/PromoteModal";
import ResetPasswordModal from "../../../components/modal/ResetPasswordModal";
import DeleteModal from "../../../components/modal/DeleteModal";
import { useState } from "react";

const ContributorDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [promoteModal, setPromoteModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleOpenPromote = () => {
    setPromoteModal(true);
  };
  const handleClosePromote = () => {
    setPromoteModal(false);
  };
  const handleOpenReset = () => {
    setResetModal(true);
  };
  const handleCloseReset = () => {
    setResetModal(false);
  };
  const handleOpenDelete = () => {
    setDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setDeleteModal(false);
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
          <Box display="flex" flexDirection="column">
            <Typography variant="h4" sx={{ my: "20px" }} fontWeight="bold">
              Contributor Information
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
            onClick={handleOpenPromote}
            startIcon={<SwitchAccessShortcutOutlinedIcon />}
          >
            Promote
          </Button>
          {/* <Button
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
            onClick={handleOpenReset}
            startIcon={<LockResetOutlinedIcon />}
          >
            Reset Password
          </Button> */}
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
            onClick={handleOpenDelete}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Delete
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
        <ContributorDetailTableContent />
      </Box>
      <PromoteModal open={promoteModal} handleClose={handleClosePromote} />
      {/* <ResetPasswordModal open={resetModal} handleClose={handleCloseReset} /> */}
      <DeleteModal open={deleteModal} handleClose={handleCloseDelete} />
    </Box>
  );
};

export default ContributorDetails;
