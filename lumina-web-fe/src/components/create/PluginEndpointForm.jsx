import React from "react";
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
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Enter Plugin Endpoint 🌐</Typography>
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
