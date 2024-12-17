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

const PromoteModal = ({ open, handleClose, handlePromote }) => {
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
          Promote Contributor
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Confirm to promote contributor to admin?
        </Typography>
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
          onClick={() => {
            handlePromote();
            handleClose();
          }}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.blueAccent[500],
          }}
        >
          Promote
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromoteModal;
