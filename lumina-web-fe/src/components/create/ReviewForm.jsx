import React from "react";
import { Box, Divider, Typography, Link } from "@mui/material";
import { Grid } from "@mui/system";
import { useState, useEffect } from "react";

const ReviewForm = ({
  formRef,
  file,
  name,
  category,
  description,
  yamlFile,
  endpoint,
  path,
  requestFormat,
  requestContentType,
  requestBodyQueryKey,
  authType,
  apiKey,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography ref={formRef} variant="h4">
        Review and submit! 💻
      </Typography>
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
      {!yamlFile && (
        <Box display="flex" flexDirection="column" gap={2}>
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
              Request Format:
            </Typography>
            <Typography variant="body1">{requestFormat}</Typography>
          </Box>
          {requestFormat === "application/json" && (
            <Box display="flex" flexDirection="row" gap={2}>
              <Typography variant="body1" fontWeight="bold">
                Request Body Content Type:
              </Typography>
              <Typography variant="body1">{requestContentType}</Typography>
            </Box>
          )}
          {requestFormat === "application/json" && (
            <Box display="flex" flexDirection="row" gap={2}>
              <Typography variant="body1" fontWeight="bold">
                Request Body Schema:
              </Typography>
              <Typography variant="body1">{requestBodyQueryKey}</Typography>
            </Box>
          )}
          <Box display="flex" flexDirection="row" gap={2}>
            <Typography variant="body1" fontWeight="bold">
              Authentication Type
            </Typography>
            <Typography variant="body1">{authType}</Typography>
          </Box>
          {authType === "apiKey" && (
            <Box display="flex" flexDirection="row" gap={2}>
              <Typography variant="body1" fontWeight="bold">
                Api Key
              </Typography>
              <Typography variant="body1">{apiKey}</Typography>
            </Box>
          )}
        </Box>
      )}
      {yamlFile && (
        <Box>
          <Box display="flex" flexDirection="row" gap={2}>
            <Box display="flex" flexDirection="row">
              <Typography variant="h6" alignSelf="center" mr={1}>
                File Uploaded:
              </Typography>
              <Link
                href={URL.createObjectURL(yamlFile)}
                download={yamlFile.name}
                alignSelf="center"
              >
                {yamlFile.name}
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ReviewForm;
