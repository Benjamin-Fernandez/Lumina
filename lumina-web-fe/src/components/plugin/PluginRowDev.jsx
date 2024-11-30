import { Box, Typography, Button } from "@mui/material";
import { Grid } from "@mui/system";
// import { tokens } from "../../theme";
import React, { useState } from "react";
import DeactivateModal from "../modal/DeactivateModal";
import ReactivateModal from "../modal/ReactivateModal";

const PluginRowDev = ({ name, activated, version, category, image }) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [reactivateModal, setReactivateModal] = useState(false);

  const handleOpenDeactivate = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDeactivateModal(true);
  };

  const handleCloseDeactivate = () => {
    setDeactivateModal(false);
  };
  const handleOpenReactivate = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setReactivateModal(true);
  };

  const handleCloseReactivate = () => {
    setReactivateModal(false);
  };

  return (
    <Box justifyContent="center">
      <Grid container spacing={2} alignItems="center">
        <Grid
          item
          size={4}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Box
            component="img"
            src={`${image}`}
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
            {name}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {version}
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
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {activated ? "Active" : "Inactive"}
          </Typography>
        </Grid>
        <Grid item size={2}>
          {activated === true && (
            <Button
              variant="contained"
              color="error"
              sx={{ textTransform: "none", fontSize: "13px", borderRadius: 2 }}
              onClick={handleOpenDeactivate}
            >
              Deactivate
            </Button>
          )}
          {activated === false && (
            <Button
              variant="contained"
              color="success"
              sx={{ textTransform: "none", fontSize: "13px", borderRadius: 2 }}
              onClick={handleOpenReactivate}
            >
              Activate
            </Button>
          )}
        </Grid>
      </Grid>
      <DeactivateModal
        open={deactivateModal}
        handleClose={handleCloseDeactivate}
      />
      <ReactivateModal
        open={reactivateModal}
        handleClose={handleCloseReactivate}
      />
    </Box>
  );
};

export default PluginRowDev;
