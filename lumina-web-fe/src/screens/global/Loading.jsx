import React from "react";
import { Box, Typography } from "@mui/material";
import ".//Loading.css";
const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      mt={"25vh"}
      className="loading-spinner-container"
    >
      <img
        src="/assets/logo.png"
        alt="logo"
        width={100}
        height={100}
        className="loading-spinner"
      />
      <Typography variant="h3" mt={4} alignSelf="center">
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
