import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { config } from "../../config";

const LogOutModal = ({ open, handleClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleLogout = () => {
    // Clear tokens or user session data stored in localStorage
    localStorage.removeItem("msal." + config.appId + ".idtoken"); // Example MSAL token clear, adjust based on storage keys
    localStorage.removeItem("user_session"); // Remove any custom session data if you have any

    // Redirect to the login page or home page
    window.location.href = "/"; // Change this to any desired page
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3, // Adds border radius
          padding: 2, // Increases padding inside the dialog
          width: 400, // Sets width of the dialog
          height: 200, // Sets height of the dialog
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Logout
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">Confirm to logout?</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.grey[800],
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.redAccent[500],
          }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogOutModal;
