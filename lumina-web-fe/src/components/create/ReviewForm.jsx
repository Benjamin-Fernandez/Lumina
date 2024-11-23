import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { useState, useEffect } from "react";

const ReviewForm = ({
  file,
  name,
  category,
  description,
  endpoint,
  path,
  httpMethod,
  parametersRequired,
  parameters,
  requestBodyRequired,
  requestFormat,
  requestContentType,
  requestBodySchema,
  responseStatusCode,
  responseContentType,
  responseSchema,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  useEffect(() => {
    if (file && file[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file[0]);
    }
  }, [file]);
  console.log(file[0]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Review and submit! 💻</Typography>
      <Typography variant="body1">
        Review your plugin details and endpoint before submitting it to the
        Lumina store!
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        Plugin Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={2} my={2}>
          {imageSrc && (
            <Box
              component="img"
              src={imageSrc}
              height="120px"
              width="120px"
              borderRadius="50%"
              objectFit="cover"
              alt="plugin"
            />
          )}
        </Grid>
        <Grid item size={6} mt={3} display="flex" flexDirection="column">
          <Grid container gap={2} display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" gap={2}>
              <Typography variant="body1" fontWeight="bold">
                Name:{" "}
              </Typography>
              <Typography variant="body1">{name}</Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={2}>
              <Typography variant="body1" fontWeight="bold">
                Category:
              </Typography>
              <Typography variant="body1">{category}</Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={2}>
              <Typography variant="body1" fontWeight="bold">
                Description:{" "}
              </Typography>
              <Typography variant="body1">{description}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Typography variant="h5" fontWeight="bold">
        Plugin Endpoint
      </Typography>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Server URL:
        </Typography>
        <Typography variant="body1">{endpoint}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Path:
        </Typography>
        <Typography variant="body1"> {path}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          HTTP Method:
        </Typography>
        <Typography variant="body1"> {httpMethod}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Parameters Required:
        </Typography>
        <Typography variant="body1">{parametersRequired}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Parameters:
        </Typography>
        <Typography variant="body1">{parameters}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Request Body Required:
        </Typography>
        <Typography variant="body1">{requestBodyRequired}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Request Format:
        </Typography>
        <Typography variant="body1">{requestFormat}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Request Body Content Type:
        </Typography>
        <Typography variant="body1">{requestContentType}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Request Body Schema:
        </Typography>
        <Typography variant="body1">{requestBodySchema}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Response Status Code:
        </Typography>
        <Typography variant="body1">{responseStatusCode}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Response Content Type:
        </Typography>
        <Typography variant="body1">{responseContentType}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Response Schema:
        </Typography>
        <Typography variant="body1">{responseSchema}</Typography>
      </Box>
    </Box>
  );
};

export default ReviewForm;
