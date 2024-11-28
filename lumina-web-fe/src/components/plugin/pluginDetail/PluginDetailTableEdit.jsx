import React from "react";
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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import IconButton from "@mui/material/IconButton";
import { tokens } from "../../../theme";

const PluginDetailTableEdit = ({ selectedSection }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      {selectedSection === "details" && (
        <Grid container spacing={2} mb="15px">
          <Grid item size={6}>
            <TextField
              fullWidth
              label={"Name of plugin"}
              //   value={name}
              //   onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              fullWidth
              label={"Version"}
              //   value={version}
              //   onChange={(e) => setVersion(e.target.value)}
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
                // value={category}
                label={"Category"}
                // onChange={(e) => setCategory(e.target.value)}
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
              //   value={description}
              multiline={true}
              rows={4}
              required
              //   onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      )}
      {selectedSection === "endpoints" && (
        <Grid container spacing={2} mb="15px">
          <Grid item size={12}>
            <Divider>Upload your own OpenAPI 3.0 Schema</Divider>
          </Grid>
          <Grid item size={6}>
            <Button
              variant="contained"
              download
              href="/sampleSchema.yaml"
              fullWidth
            >
              Download Current YAML file
            </Button>
          </Grid>
          <Grid item size={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload YAML file
              <input
                type="file"
                hidden
                accept=".yaml,application/x-yaml" // Restrict to YAML files
                // ref={fileInputRef} // Attach ref to file input
                // onChange={handleFileChange}
                maxLength={1} // Limit to only 1 file
              />
            </Button>
          </Grid>
          <Grid item size={12}>
            <Divider>
              {" "}
              OR edit details below to generate a new OpenAPI 3.0 Schema{" "}
            </Divider>
          </Grid>
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
                helperText="E.g. https://api.example.com"
                // value={endpoint}
                // onChange={(e) => setEndpoint(e.target.value)}
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
                // value={path}
                // onChange={(e) => setPath(e.target.value)}
                required
              />
            </Tooltip>
          </Grid>

          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Request
            </Typography>
          </Grid>
          <Grid item size={12}>
            <Tooltip
              title={<Typography>Type of HTTP request.</Typography>}
              placement="top"
            >
              <FormControl fullWidth required>
                <InputLabel id="requestType">HTTP Method</InputLabel>
                <Select
                  fullWidth
                  labelId="httpMethod"
                  id="httpMethod"
                  //   value={httpMethod}
                  label={"httpMethod"}
                  //   onChange={(e) => setHttpMethod(e.target.value)}
                >
                  <MenuItem value={"GET"}>GET</MenuItem>
                  <MenuItem value={"PUT"}>PUT</MenuItem>
                  <MenuItem value={"POST"}>POST</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Request Parameters
            </Typography>
          </Grid>

          <Grid item size={6}>
            <Tooltip
              title={
                <Typography>
                  Boolean value of whether parameters are required or not.
                </Typography>
              }
              placement="top"
            >
              <FormControl fullWidth required>
                <InputLabel id="requestFormat">Parameters Required</InputLabel>
                <Select
                  fullWidth
                  labelId="parametersRequired"
                  id="parametersRequired"
                  //   value={parametersRequired}
                  label={"parametersRequired"}
                  //   onChange={(e) => setParametersRequired(e.target.value)}
                >
                  <MenuItem value={"true"}>True</MenuItem>
                  <MenuItem value={"false"}>False</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
          <Grid item size={6}>
            <Tooltip
              title={
                <Typography>
                  List of parameters, their location (query, header, etc.),
                  types.
                </Typography>
              }
              placement="top"
            >
              <TextField
                fullWidth
                label={"Parameters"}
                required
                helperText={
                  <>E.g. &#123; "query": "string", "header": "JWT" &#125;</>
                }
                // value={parameters}
                // onChange={(e) => setParameters(e.target.value)}
              />
            </Tooltip>
          </Grid>
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Request Body
            </Typography>
          </Grid>
          <Grid item size={6}>
            <Tooltip
              title={
                <Typography>
                  Boolean value of whether request body is required or not.
                </Typography>
              }
              placement="top"
            >
              <FormControl fullWidth required>
                <InputLabel id="requestBodyRequired">
                  Request Body Required
                </InputLabel>
                <Select
                  fullWidth
                  labelId="requestBodyRequired"
                  id="requestBodyRequired"
                  //   value={requestBodyRequired}
                  label={"requestBodyRequired"}
                  //   onChange={(e) => setRequestBodyRequired(e.target.value)}
                >
                  <MenuItem value={"true"}>True</MenuItem>
                  <MenuItem value={"false"}>False</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>

          <Grid item size={6}>
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
                  //   value={requestFormat}
                  label={"requestFormat"}
                  //   onChange={(e) => setRequestFormat(e.target.value)}
                >
                  <MenuItem value={""}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"application/json"}>
                    application/json
                  </MenuItem>
                  <MenuItem value={"application/x-www-form-urlencoded"}>
                    application/x-www-form-urlencoded
                  </MenuItem>
                  <MenuItem value={"text/plain"}>text/plain</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>

          <Grid item size={6}>
            <Tooltip
              title={
                <Typography>
                  Data type of the request payload, if applicable.
                </Typography>
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
                  //   value={requestContentType}
                  label={"requestContentType"}
                  //   onChange={(e) => setRequestContentType(e.target.value)}
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
          <Grid item size={6}>
            <Tooltip
              title={
                <Typography>
                  Structure of the request payload, if applicable.
                </Typography>
              }
              placement="top"
            >
              <TextField
                fullWidth
                label={"Request Body Schema"}
                required
                helperText={
                  <>E.g. &#123; "name": "string", "age": "integer" &#125;</>
                }
                // value={requestBodyQueryKey}
                // onChange={(e) => setRequestBodyQueryKey(e.target.value)}
              />
            </Tooltip>
          </Grid>
          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Response
            </Typography>
          </Grid>

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
                helperText={<>E.g. "200"</>}
                // value={responseStatusCode}
                // onChange={(e) => setResponseStatusCode(e.target.value)}
              />
            </Tooltip>
          </Grid>

          <Grid item size={6}>
            <Tooltip
              title={<Typography>Format of the response payload</Typography>}
              placement="top"
            >
              <FormControl fullWidth required>
                <InputLabel id="responseFormat">
                  Response Content Type
                </InputLabel>
                <Select
                  fullWidth
                  labelId="responseFormat"
                  id="responseFormat"
                  //   value={responseFormat}
                  label={"responseFormat"}
                  //   onChange={(e) => setResponseFormat(e.target.value)}
                >
                  <MenuItem value={"application/json"}>
                    application/json
                  </MenuItem>
                  <MenuItem value={"text/plain"}>text/plain</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
          <Grid item size={6}>
            <Tooltip
              title={<Typography>Structure of the response payload</Typography>}
              placement="top"
            >
              <TextField
                required
                fullWidth
                label={"Response Schema"}
                helperText={<>E.g. &#123; "type": "string" &#125;</>}
                // value={responseBodyKey}
                // onChange={(e) => setResponseBodyKey(e.target.value)}
              />
            </Tooltip>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PluginDetailTableEdit;
