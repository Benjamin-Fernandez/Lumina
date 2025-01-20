import React, { useEffect, useRef } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { Grid } from "@mui/system";

const PluginEndpointForm = ({
  formRef,
  endpoint,
  path,
  requestFormat,
  requestContentType,
  requestBodyQueryKey,
  setEndpoint,
  setPath,
  setRequestFormat,
  setRequestBodyQueryKey,
  setRequestContentType,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" ref={formRef}>
        Enter Plugin Endpoint 🌐
      </Typography>
      <Typography variant="body1">
        Plugin endpoint is where your chatbot lives! Fill in the details below
        to ensure a seamless integration with Lumina:
      </Typography>
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <Tooltip
            title={
              <Typography>The base URL where the API is hosted.</Typography>
            }
            placement="top"
            fullWidth
          >
            <TextField
              label={"Server URL"}
              helperText="E.g. https://workshop-plugins.azurewebsites.net"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              required
            />
          </Tooltip>
        </Grid>
        <Grid item size={6}>
          <Tooltip
            title={
              <Typography>
                Relative endpoint path that Lumina will use to send user queries
                and receive responses.
              </Typography>
            }
            placement="top"
          >
            <TextField
              fullWidth
              label={"Path"}
              helperText="E.g. /api/cdefg-plugin"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
            />
          </Tooltip>
        </Grid>
      </Grid>
      <Typography variant="body1">Request Body</Typography>

      <Grid container spacing={2} mb="15px">
        <Grid size={12}>
          <Tooltip
            title={<Typography>Format of the response.</Typography>}
            placement="top"
          >
            <FormControl fullWidth required>
              <InputLabel id="requestFormat">Request Format</InputLabel>
              <Select
                fullWidth
                labelId="requestFormat"
                id="requestFormat"
                value={requestFormat}
                label={"requestFormat"}
                onChange={(e) => setRequestFormat(e.target.value)}
              >
                <MenuItem value={""}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"application/json"}>application/json</MenuItem>
                {/* <MenuItem value={"application/x-www-form-urlencoded"}>
                  application/x-www-form-urlencoded
                </MenuItem> */}
                <MenuItem value={"text/plain"}>text/plain</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        {requestFormat == "application/json" && (
          <Grid size={6}>
            <Tooltip
              title={<Typography>Data type of the request payload</Typography>}
              placement="top"
            >
              <FormControl fullWidth required>
                <InputLabel id="requestContentType">
                  Request Body Content Type
                </InputLabel>
                <Select
                  fullWidth
                  labelId="requestContentType"
                  id="requestContentType"
                  value={requestContentType}
                  label={"requestContentType"}
                  onChange={(e) => setRequestContentType(e.target.value)}
                >
                  <MenuItem value={""}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"string"}>String</MenuItem>
                  <MenuItem value={"object"}>Object</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        )}
        {requestFormat == "application/json" && (
          <Grid size={6}>
            <Tooltip
              title={
                <Typography>
                  Key of the property that contain user query
                </Typography>
              }
              placement="top"
            >
              <TextField
                fullWidth
                label={"Request Body Query Key"}
                required
                helperText={<>E.g. query </>}
                value={requestBodyQueryKey}
                onChange={(e) => setRequestBodyQueryKey(e.target.value)}
              />
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PluginEndpointForm;
