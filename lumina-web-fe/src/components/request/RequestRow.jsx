import {
  Box,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Grid, textTransform, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { useState } from "react";
import ApproveDeployModal from "../modal/ApproveDeployModal";
import RejectModal from "../modal/RejectModal";

const RequestRow = ({
  title,
  author,
  version,
  size,
  category,
  action,
  displayPic,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenApprove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setApproveModal(true);
  };

  const handleCloseApprove = () => {
    setApproveModal(false);
  };

  const handleOpenReject = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setRejectModal(true);
  };

  const handleCloseReject = () => {
    setRejectModal(false);
  };

  return (
    <Box justifyContent="center">
      <Grid container spacing={2} alignItems="center">
        <Grid
          item
          size={3}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Box
            component="img"
            src={displayPic}
            width={40}
            height={40}
            borderRadius="50%"
            mr={1}
          />
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {author}
          </Typography>
        </Grid>
        <Grid item size={1}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {version}
          </Typography>
        </Grid>
        <Grid item size={1}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {size}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {category}
          </Typography>
        </Grid>

        <Grid item size={3}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "13px",
              bgcolor: colors.blueAccent[500],
              width: "65%",
              mr: 1,
            }}
            onClick={handleOpenApprove}
          >
            {action}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none", fontSize: "13px" }}
            onClick={handleOpenReject}
          >
            Reject
          </Button>
        </Grid>
      </Grid>
      <ApproveDeployModal
        open={approveModal}
        handleClose={handleCloseApprove}
      />
      <RejectModal open={rejectModal} handleClose={handleCloseReject} />
    </Box>
  );
};

export default RequestRow;
