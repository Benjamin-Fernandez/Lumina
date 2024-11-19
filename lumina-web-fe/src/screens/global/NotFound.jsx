import React from "react";
import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box display="flex" flexDirection="column" mt={"30vh"}>
      <Box
        component={"img"}
        src="/assets/logo.png"
        alt="404"
        width={100}
        height={100}
        alignSelf="center"
      />
      <Typography variant="h3" mt={4} alignSelf="center">
        Oops! Page not found! 😢
      </Typography>
      <Typography variant="h5" mt={4} alignSelf="center">
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
};

export default NotFound;
