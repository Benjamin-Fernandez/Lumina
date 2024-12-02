import React, { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Link,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import { useTheme, Grid } from "@mui/system";

import { tokens } from "../../../theme";

const PluginDetailTableEdit = ({ selectedSection, plugin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [name, setName] = useState(plugin.name);
  const [version, setVersion] = useState(plugin.version);
  const [category, setCategory] = useState(plugin.category);
  const [description, setDescription] = useState(plugin.description);
  const [endpoint, setEndpoint] = useState(plugin.endpoint);
  const [path, setPath] = useState(plugin.path);
  const [requestFormat, setRequestFormat] = useState(plugin.requestFormat);
  const [requestContentType, setRequestContentType] = useState(
    plugin.requestContentType
  );
  const [requestBodyQueryKey, setRequestBodyQueryKey] = useState(
    plugin.requestBodyQueryKey
  );
  const [responseStatusCode, setResponseStatusCode] = useState(
    plugin.responseStatusCode
  );
  const [responseFormat, setResponseFormat] = useState(plugin.responseFormat);
  const [responseBodyKey, setResponseBodyKey] = useState(
    plugin.responseBodyKey
  );

  return (
    <Box width="100%" height="50vh" pl={3} sx={{ overflowY: "auto" }} py={1}>
      {selectedSection === "details" && (
        <Grid container spacing={2} mb="15px">
          <Grid item size={6}>
            <TextField
              fullWidth
              label={"Name of plugin"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              fullWidth
              label={"Version"}
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              required
            />
          </Grid>
          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={12}>
            <FormControl fullWidth required>
              <InputLabel id="category">Category</InputLabel>
              <Select
                fullWidth
                labelId="Category"
                id="category"
                value={category}
                label={"Category"}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value={"Module"}>Module</MenuItem>
                <MenuItem value={"NTU"}>NTU</MenuItem>
                <MenuItem value={"Career"}>Career</MenuItem>
                <MenuItem value={"General"}>General</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={12}>
            <TextField
              fullWidth
              label={"Description"}
              value={description}
              multiline={true}
              rows={4}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      )}
      {selectedSection === "endpoints" && (
        <Box>
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
                  helperText="E.g. https://api.example.com:8000"
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
                    Relative endpoint path that Lumina will use to send user
                    queries and receive responses.
                  </Typography>
                }
                placement="top"
              >
                <TextField
                  fullWidth
                  label={"Path"}
                  helperText="E.g. /getResponse"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  required
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Typography variant="body1" mb="15px">
            Request Body
          </Typography>

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
                    <MenuItem value={"application/json"}>
                      application/json
                    </MenuItem>
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
                  title={
                    <Typography>Data type of the request payload</Typography>
                  }
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
          <Typography variant="body1" mb="15px">
            Response
          </Typography>
          <Grid container spacing={2} mb="15px">
            <Grid item size={6}>
              <Tooltip
                title={
                  <Typography>
                    HTTP status code for successful response
                  </Typography>
                }
                placement="top"
              >
                <TextField
                  fullWidth
                  label={"Response Status Code"}
                  required
                  helperText={<>E.g. 200</>}
                  value={responseStatusCode}
                  onChange={(e) => setResponseStatusCode(e.target.value)}
                />
              </Tooltip>
            </Grid>
            <Grid item size={6}>
              <Tooltip
                title={<Typography>Format of the response payload</Typography>}
                placement="top"
              >
                <FormControl fullWidth required>
                  <InputLabel id="responseFormat">Response Format</InputLabel>
                  <Select
                    fullWidth
                    labelId="responseFormat"
                    id="responseFormat"
                    value={responseFormat}
                    label={"responseFormat"}
                    onChange={(e) => setResponseFormat(e.target.value)}
                  >
                    <MenuItem value={"application/json"}>
                      application/json
                    </MenuItem>
                    <MenuItem value={"text/plain"}>text/plain</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid item size={12}>
              <Tooltip
                title={
                  <Typography>
                    Key of the property that contain model's response
                  </Typography>
                }
                placement="top"
              >
                <TextField
                  required
                  fullWidth
                  label={"Response Body Key"}
                  helperText={<>response</>}
                  value={responseBodyKey}
                  onChange={(e) => setResponseBodyKey(e.target.value)}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default PluginDetailTableEdit;
