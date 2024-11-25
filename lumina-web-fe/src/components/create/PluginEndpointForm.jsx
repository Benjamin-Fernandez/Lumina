import React, { useRef } from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  Divider,
  Button,
  IconButton,
  Link,
} from "@mui/material";
import { Grid } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";

const PluginEndpointForm = ({
  yamlFile,
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
  setYamlFile,
  setEndpoint,
  setPath,
  setHttpMethod,
  setParametersRequired,
  setParameters,
  setRequestBodyRequired,
  setRequestFormat,
  setRequestBodySchema,
  setRequestContentType,
  setResponseStatusCode,
  setResponseContentType,
  setResponseSchema,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      // Check if the file is a YAML file
      if (
        uploadedFile.type === "application/x-yaml" ||
        uploadedFile.name.endsWith(".yaml")
      ) {
        setYamlFile(uploadedFile);
      } else {
        alert("Please upload a valid YAML file.");
        setYamlFile(null);
      }
    }
  };
  const handleDeleteFile = () => {
    setYamlFile(null);
    // Reset the file input to allow re-upload of the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Enter Plugin Endpoint 🌐</Typography>
      <Typography variant="body1">
        Plugin endpoint is where your chatbot lives! Fill in the details below
        to ensure a seamless integration with Lumina:
      </Typography>

      <Divider>Upload your own OpenAPI 3.0 Schema</Divider>
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <Button
            variant="contained"
            download
            href="/sampleSchema.yaml"
            fullWidth
          >
            Download Sample YAML file
          </Button>
        </Grid>
        <Grid item size={6}>
          <Button variant="outlined" component="label" fullWidth>
            Upload YAML file
            <input
              type="file"
              hidden
              accept=".yaml,application/x-yaml" // Restrict to YAML files
              ref={fileInputRef} // Attach ref to file input
              onChange={handleFileChange}
              maxLength={1} // Limit to only 1 file
            />
          </Button>
        </Grid>
        <Grid item size={12}>
          {yamlFile && (
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
              <IconButton onClick={handleDeleteFile} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Grid>
      </Grid>

      <Divider>
        OR fill in details below to generate an OpenAPI 3.0 Schema
      </Divider>

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
              helperText="E.g. https://api.example.com"
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
              helperText="E.g. /getResponse"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
            />
          </Tooltip>
        </Grid>
      </Grid>
      <Typography variant="body1">Request</Typography>

      <Grid container spacing={2} mb="15px">
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
                value={httpMethod}
                label={"httpMethod"}
                onChange={(e) => setHttpMethod(e.target.value)}
              >
                <MenuItem value={"GET"}>GET</MenuItem>
                <MenuItem value={"PUT"}>PUT</MenuItem>
                <MenuItem value={"POST"}>POST</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid item size={12}>
          <Typography variant="body1" color="grey">
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
                value={parametersRequired}
                label={"parametersRequired"}
                onChange={(e) => setParametersRequired(e.target.value)}
              >
                <MenuItem value={"true"}>True</MenuItem>
                <MenuItem value={"false"}>False</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid size={6}>
          <Tooltip
            title={
              <Typography>
                List of parameters, their location (query, header, etc.), types.
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
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
            />
          </Tooltip>
        </Grid>
        <Grid item size={12}>
          <Typography variant="body1" color="grey">
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
                value={requestBodyRequired}
                label={"requestBodyRequired"}
                onChange={(e) => setRequestBodyRequired(e.target.value)}
              >
                <MenuItem value={"true"}>True</MenuItem>
                <MenuItem value={"false"}>False</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid size={6}>
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
                <MenuItem value={"application/x-www-form-urlencoded"}>
                  application/x-www-form-urlencoded
                </MenuItem>
                <MenuItem value={"text/plain"}>text/plain</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid size={6}>
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
        <Grid size={6}>
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
              value={requestBodySchema}
              onChange={(e) => setRequestBodySchema(e.target.value)}
            />
          </Tooltip>
        </Grid>
      </Grid>
      <Typography variant="body1">Response</Typography>
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <Tooltip
            title={
              <Typography>HTTP status code for successful response</Typography>
            }
            placement="top"
          >
            <TextField
              fullWidth
              label={"Response Status Code"}
              required
              helperText={<>E.g. "200"</>}
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
              <InputLabel id="responseContentType">
                Response Content Type
              </InputLabel>
              <Select
                fullWidth
                labelId="responseContentType"
                id="responseContentType"
                value={responseContentType}
                label={"responseContentType"}
                onChange={(e) => setResponseContentType(e.target.value)}
              >
                <MenuItem value={"application/json"}>application/json</MenuItem>
                <MenuItem value={"text/plain"}>text/plain</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid item size={12}>
          <Tooltip
            title={<Typography>Structure of the response payload</Typography>}
            placement="top"
          >
            <TextField
              required
              fullWidth
              label={"Response Schema"}
              helperText={<>E.g. &#123; "type": "string" &#125;</>}
              value={responseSchema}
              onChange={(e) => setResponseSchema(e.target.value)}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PluginEndpointForm;
