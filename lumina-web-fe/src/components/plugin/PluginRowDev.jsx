import { Box, Typography, Button } from "@mui/material";
import { Grid } from "@mui/system";
// import { tokens } from "../../theme";
import React, { useState } from "react";
import DeactivateModal from "../modal/DeactivateModal";
import ReactivateModal from "../modal/ReactivateModal";

const PluginRowDev = ({ name, activated, version, category, image, date }) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
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
          <Typography variant="body1">
            {new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PluginRowDev;
