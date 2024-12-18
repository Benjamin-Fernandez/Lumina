import { Box, Typography, Button } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import DemoteModal from "../modal/DemoteModal";
import PromoteModal from "../modal/PromoteModal";
import { useState } from "react";

const ContributorRow = ({
  name,
  domain,
  email,
  joined,
  handlePromote,
  handleDemote,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [promoteModal, setPromoteModal] = useState(false);
  const [demoteModal, setDemoteModal] = useState(false);

  const handleOpenPromote = (event) => {
    setPromoteModal(true);
  };
  const handleClosePromote = () => {
    setPromoteModal(false);
  };
  const handleOpenDemote = (event) => {
    setDemoteModal(true);
  };
  const handleCloseDemote = () => {
    setDemoteModal(false);
  };

  return (
    <Box justifyContent="center">
      <Grid container spacing={2} alignItems="center">
        <Grid item size={3}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item size={3}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {email}
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
            {joined.split("T")[0]}
          </Typography>
        </Grid>
        <Grid item size={2}>
          {domain === "Developer" && (
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
          )}
          {domain === "Admin" && (
            <Button
              variant="contained"
              color="error"
              sx={{ textTransform: "none", fontSize: "13px" }}
              onClick={handleOpenDemote}
            >
              Demote
            </Button>
          )}
        </Grid>
      </Grid>
      <DemoteModal
        open={demoteModal}
        handleClose={handleCloseDemote}
        handleDemote={handleDemote}
      />
      <PromoteModal
        open={promoteModal}
        handleClose={handleClosePromote}
        handlePromote={handlePromote}
      />
    </Box>
  );
};

export default ContributorRow;
