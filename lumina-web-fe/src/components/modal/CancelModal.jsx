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

const CancelModal = ({ open, handleClose, handleBack }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
          Cancel Edit
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Your changes will be lost. Are you sure you want to cancel?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleBack}
          color="primary"
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.grey[800],
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleClose}
          color="error"
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelModal;
