import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../../theme";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ContributorDetailTableContent from "../../../components/contributor/ContributorDetailTableContent";
import LogOutModal from "../../../components/modal/LogOutModal";
import { useState } from "react";

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [logoutModal, setLogoutModal] = useState(false);

  const handleOpenLogout = () => {
    setLogoutModal(true);
  };
  const handleCloseLogout = () => {
    setLogoutModal(false);
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
      {/* <Box
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
            onClick={handleOpenReset}
            startIcon={<LockResetOutlinedIcon />}
          >
            Reset Password
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
            onClick={handleOpenDelete}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Delete
          </Button>
        </Box>
      </Box> */}
      <Box display="flex" flexDirection="row">
        <ContributorDetailTableContent />
      </Box>
      {/* <Button
        sx={{
          bgcolor: colors.yellowAccent[500],
          width: "100%",
          padding: "8px 16px", // Adjust padding to hug content
          alignSelf: "flex-end", // Position the button at the bottom of the Box
          textTransform: "none",
          fontSize: "13px",
          color: "white",
          borderRadius: 2,
          my: 2,
        }}
        onClick={handleOpenReset}
        startIcon={<LockResetOutlinedIcon />}
      >
        Change Password
      </Button> */}
      <Button
        sx={{
          bgcolor: colors.redAccent[500],
          width: "100%",
          padding: "8px 16px", // Adjust padding to hug content
          alignSelf: "flex-end", // Position the button at the bottom of the Box
          textTransform: "none",
          fontSize: "13px",
          color: "white",
          borderRadius: 2,
          mt: 4,
        }}
        onClick={handleOpenLogout}
        startIcon={<LogoutOutlinedIcon />}
      >
        Logout
      </Button>
      {/* <ChangePasswordModal open={resetModal} handleClose={handleCloseReset} /> */}
      <LogOutModal open={logoutModal} handleClose={handleCloseLogout} />
    </Box>
  );
};

export default Profile;
