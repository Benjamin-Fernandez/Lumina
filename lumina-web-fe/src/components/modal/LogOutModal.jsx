import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { config } from "../../config";
import { useMsal } from "@azure/msal-react";

const LogOutModal = ({ open, handleClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { instance } = useMsal();

  const handleLogout = () => {
    // Clear tokens or user session data stored in localStorage
    sessionStorage.clear();
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
