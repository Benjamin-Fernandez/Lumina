import React from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Grid } from "@mui/system";

const PluginEndpointForm = ({
  endpoint,
  requestType,
  responseType,
  requestFormat,
  requestKey,
  responseKey,
  setEndpoint,
  setRequestType,
  setResponseType,
  setRequestFormat,
  setRequestKey,
  setResponseKey,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Enter Plugin Endpoint 🌐</Typography>
      <Typography variant="body1">
        Plugin endpoint is where your chatbot lives! Make sure to provide the
        correct endpoint so students can interact with your chatbot!
      </Typography>
      <Grid container spacing={2} mb="15px">
        <Grid item size={12}>
          <TextField
            fullWidth
            label={"Plugin endpoint"}
            helperText="E.g. https://your-chatbot-endpoint.com"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            required
          />
        </Grid>
      </Grid>
      <Typography variant="body1">Request</Typography>
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <FormControl fullWidth required>
            <InputLabel id="requestType">Request Type</InputLabel>
            <Select
              fullWidth
              labelId="requestType"
              id="requestType"
              value={requestType}
              label={"requestType"}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <MenuItem value={"GET"}>GET</MenuItem>
              <MenuItem value={"PUT"}>PUT</MenuItem>
              <MenuItem value={"POST"}>POST</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item size={6}>
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
              <MenuItem value={"requestBody"}>Request Body</MenuItem>
              <MenuItem value={"parameters"}>Parameters</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label={"Key"}
            required
            helperText={
              <>
                Specifies the key associated with the user query in the JSON
                request body OR parameter. <br /> For example, in the request
                body &#123; 'query': 'Hello! Can you help me with ...', &#125;
                the key would be query.
              </>
            }
            value={requestKey}
            onChange={(e) => setRequestKey(e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="body1">Response</Typography>
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <FormControl fullWidth required>
            <InputLabel id="responseType">Response Type</InputLabel>
            <Select
              fullWidth
              labelId="responseType"
              id="responseType"
              value={responseType}
              label={"responseType"}
              onChange={(e) => setResponseType(e.target.value)}
            >
              <MenuItem value={"JSON"}>JSON</MenuItem>
              <MenuItem value={"HTML"}>HTML</MenuItem>
              <MenuItem value={"XML"}>XML</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item size={6}>
          <TextField
            required
            fullWidth
            label={"Key"}
            helperText={
              <>
                Specifies the key associated with the user query in the JSON
                request body OR parameter. <br /> For example, in the request
                body &#123; 'query': 'Hello! Can you help me with ...', &#125;
                the key would be query.
              </>
            }
            value={responseKey}
            onChange={(e) => setResponseKey(e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PluginEndpointForm;
