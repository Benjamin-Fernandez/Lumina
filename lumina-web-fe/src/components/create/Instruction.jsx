import React from "react";
import { Box, Typography } from "@mui/material";

const Instruction = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Instructions
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is the instruction page. Here you will find the steps to create a
        plugin.
      </Typography>
    </Box>
  );
};

export default Instruction;
