import React from "react";
import { Box, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box display="flex" flexDirection="column" mt={"25vh"}>
      <Box
        component={"img"}
        src="/assets/logo.png"
        alt="404"
        width={100}
        height={100}
        alignSelf="center"
      />
      <Typography variant="h3" mt={4} alignSelf="center">
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
