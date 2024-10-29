import { Box, Divider, Typography, Button } from "@mui/material";
import { Grid, textTransform, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import DeleteModal from "../modal/DeleteModal";
import PromoteModal from "../modal/PromoteModal";
import { useState } from "react";

const ContributorRow = ({ name, domain, lastOnline, joined }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [promoteModal, setPromoteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleOpenPromote = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setPromoteModal(true);
  };
  const handleClosePromote = () => {
    setPromoteModal(false);
  };
  const handleOpenDelete = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setDeleteModal(false);
  };

  return (
    <Box justifyContent="center">
      <Grid container spacing={2} alignItems="center">
        <Grid item size={4}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {domain}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {lastOnline}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {joined}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "13px",
              bgcolor: colors.blueAccent[500],
              mr: 1,
            }}
            onClick={handleOpenPromote}
          >
            Promote
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none", fontSize: "13px" }}
            onClick={handleOpenDelete}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      <DeleteModal open={deleteModal} handleClose={handleCloseDelete} />
      <PromoteModal open={promoteModal} handleClose={handleClosePromote} />
    </Box>
  );
};

export default ContributorRow;
