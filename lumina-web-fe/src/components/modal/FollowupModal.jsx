import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../../theme";

const FollowupModal = ({ open, handleClose, email }) => {
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
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Follow-Up
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">Sent to: {email}</Typography>
        <TextField
          variant="outlined"
          label="Enter Message"
          multiline
          rows={8}
          fullWidth
          sx={{ mt: 3 }}
        />
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
          onClick={handleClose}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.yellowAccent[500],
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowupModal;
