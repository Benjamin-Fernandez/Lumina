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
  IconButton,
  Avatar,
} from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import { tokens } from "../../../theme";
import * as yaml from "js-yaml";
import TestEndpointModal from "../../modal/TestEndpointModal";

const PluginDetailTableEdit = ({
  selectedSection,
  editedPlugin,
  onChange,
  setEndpointSuccess,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const [testEndpointModal, setTestEndpointModal] = useState(false);
  const [yamlString, setYamlString] = useState(editedPlugin.schema);

  const generateYaml = ({
    name,
    endpoint,
    path,
    requestFormat,
    requestContentType,
    requestBodyQueryKey,
    authType,
  }) => {
    let yamlObject = {};
    if (requestFormat == "application/json") {
      if (authType === "apiKey") {
        // Create a basic structure for the YAML file
        yamlObject = {
          openapi: "3.0.0",
          info: {
            title: name + "API",
            version: "1.0.0",
          },
          servers: [
            {
              url: endpoint, // Base URL can be dynamic, for now using the example
            },
          ],
          components: {
            securitySchemes: {
              ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "Apikey",
              },
            },
          },
          security: [
            {
              ApiKeyAuth: [],
            },
          ],
          paths: {
            [path]: {
              // Dynamic path
              post: {
                operationId: "getResponse", // Example operationId based on method and path
                requestBody: {
                  required: true, // Convert to boolean
                  content: {
                    [requestFormat]: {
                      schema: {
                        type: requestContentType,
                        properties: requestBodyQueryKey,
                      },
                    },
                  },
                },
                responses: {
                  200: {
                    content: {
                      "application/json": {
                        schema: {
                          type: "string", // Default type to string if not provided
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
      } else {
        yamlObject = {
          openapi: "3.0.0",
          info: {
            title: name + "API",
            version: "1.0.0",
          },
          servers: [
            {
              url: endpoint, // Base URL can be dynamic, for now using the example
            },
          ],
          paths: {
            [path]: {
              // Dynamic path
              post: {
                operationId: "getResponse", // Example operationId based on method and path
                requestBody: {
                  required: true, // Convert to boolean
                  content: {
                    [requestFormat]: {
                      schema: {
                        type: requestContentType,
                        properties: requestBodyQueryKey,
                      },
                    },
                  },
                },
                responses: {
                  200: {
                    content: {
                      "application/json": {
                        schema: {
                          type: "string", // Default type to string if not provided
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
      }

      // Convert the JavaScript object to a YAML string
      const yamlString = yaml.dump(yamlObject);

      return yamlString;
    } else {
      if (authType === "apiKey") {
        yamlObject = {
          openapi: "3.0.0",
          info: {
            title: name + "API",
            version: "1.0.0",
          },
          servers: [
            {
              url: endpoint, // Base URL can be dynamic, for now using the example
            },
          ],
          components: {
            securitySchemes: {
              ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "Apikey",
              },
            },
          },
          security: [
            {
              ApiKeyAuth: [],
            },
          ],
          paths: {
            [path]: {
              // Dynamic path
              post: {
                operationId: "getResponse", // Example operationId based on method and path
                requestBody: {
                  required: true, // Convert to boolean
                  content: {
                    [requestFormat]: {
                      schema: {
                        type: "string",
                      },
                    },
                  },
                },
                responses: {
                  200: {
                    content: {
                      "application/json": {
                        schema: {
                          type: "string", // Default type to string if not provided
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
      } else {
        yamlObject = {
          openapi: "3.0.0",
          info: {
            title: name + "API",
            version: "1.0.0",
          },
          servers: [
            {
              url: endpoint, // Base URL can be dynamic, for now using the example
            },
          ],
          paths: {
            [path]: {
              // Dynamic path
              post: {
                operationId: "getResponse", // Example operationId based on method and path
                requestBody: {
                  required: true, // Convert to boolean
                  content: {
                    [requestFormat]: {
                      schema: {
                        type: "string",
                      },
                    },
                  },
                },
                responses: {
                  200: {
                    content: {
                      "application/json": {
                        schema: {
                          type: "string", // Default type to string if not provided
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };

        // Convert the JavaScript object to a YAML string
        const yamlString = yaml.dump(yamlObject);

        return yamlString;
      }
    }
  };

  const handleOpenTestEndpoint = () => {
    console.log("EDITED PLUGIN", editedPlugin);
    const yamlString = generateYaml({
      name: editedPlugin.name,
      endpoint: editedPlugin.endpoint,
      path: editedPlugin.path,
      requestFormat: editedPlugin.requestFormat,
      requestContentType: editedPlugin.requestContentType,
      requestBodyQueryKey: editedPlugin.requestBodyQueryKey,
      authType: editedPlugin.authType,
    });
    setYamlString(yamlString);
    setTestEndpointModal(true);
  };
  const handleCloseTestEndpoint = () => {
    setTestEndpointModal(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size exceeds 1MB. Please upload a smaller file.");
      e.target.value = null;
      return;
    }
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        onChange("image", base64);
        console.log(reader.result);
        console.log("Base64: ", base64);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Box width="100%" height="50vh" pl={3} sx={{ overflowY: "auto" }} py={1}>
      {selectedSection === "details" && (
        <Grid container spacing={2} mb="15px">
          <Grid item size={12}>
            <Typography variant="body1" mb="15px">
              Display Image
            </Typography>

            <Box display="flex" justifyContent="center">
              <input
                accept="image/*"
                type="file"
                id="file-upload"
                hidden
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <IconButton
                  component="span"
                  sx={{ width: "150px", height: "150px" }}
                >
                  {editedPlugin.base64 ? (
                    <Avatar
                      sx={{
                        width: "150px",
                        height: "150px",
                      }}
                    >
                      <img
                        src={editedPlugin.base64}
                        alt="avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </Avatar>
                  ) : (
                    <Avatar sx={{ width: "120px", height: "120px" }}>
                      <img
                        src={editedPlugin?.image}
                        alt="avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </Avatar>
                  )}
                </IconButton>
              </label>
            </Box>
          </Grid>
          <Grid item size={6}>
            <TextField
              fullWidth
              label={"Name of plugin"}
              value={editedPlugin.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </Grid>
          <Grid item size={6}>
            <TextField
              fullWidth
              label={"Version"}
              value={editedPlugin.version}
              onChange={(e) => onChange("version", e.target.value)}
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
                value={editedPlugin.category}
                label={"Category"}
                onChange={(e) => onChange("category", e.target.value)}
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
              value={editedPlugin.description}
              multiline={true}
              rows={4}
              required
              onChange={(e) => onChange("description", e.target.value)}
            />
          </Grid>
        </Grid>
      )}
      {selectedSection === "endpoints" && (
        <Box>
          <Grid container spacing={2} mb="15px">
            <Grid item size={12} mb="15px">
              <Button
                variant="contained"
                fullWidth
                onClick={handleOpenTestEndpoint}
              >
                Test Endpoint
              </Button>
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
                  helperText="E.g. https://api.example.com:8000"
                  value={editedPlugin.endpoint}
                  onChange={(e) => {
                    onChange("endpoint", e.target.value);
                    setEndpointSuccess(false);
                  }}
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
                  value={editedPlugin.path}
                  onChange={(e) => {
                    onChange("path", e.target.value);
                    setEndpointSuccess(false);
                  }}
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
                    value={editedPlugin.requestFormat}
                    label={"requestFormat"}
                    onChange={(e) => {
                      onChange("requestFormat", e.target.value);
                      setEndpointSuccess(false);
                    }}
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
            {editedPlugin.requestFormat == "application/json" && (
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
                      value={editedPlugin.requestContentType}
                      label={"requestContentType"}
                      onChange={(e) => {
                        onChange("requestContentType", e.target.value);
                        setEndpointSuccess(false);
                      }}
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
            {editedPlugin.requestFormat == "application/json" && (
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
                    value={editedPlugin.requestBodyQueryKey}
                    onChange={(e) => {
                      onChange("requestBodyQueryKey", e.target.value);
                      setEndpointSuccess(false);
                    }}
                  />
                </Tooltip>
              </Grid>
            )}
          </Grid>
          <Typography variant="body1">Authentication</Typography>
          <Grid container spacing={2} mb="15px">
            <Grid item size={6}>
              <Tooltip
                title={<Typography>Authentication Type</Typography>}
                placement="top"
              >
                <FormControl fullWidth required>
                  <InputLabel id="authType">Authentication Type</InputLabel>
                  <Select
                    fullWidth
                    labelId="authType"
                    id="authType"
                    value={editedPlugin.authType}
                    label={"authType"}
                    onChange={(e) => {
                      onChange("authType", e.target.value);
                      setEndpointSuccess(false);
                    }}
                  >
                    <MenuItem value={"none"}>None</MenuItem>
                    <MenuItem value={"apiKey"}>API Key</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
            </Grid>
            {editedPlugin.authType == "apiKey" && (
              <Grid item size={6}>
                <Tooltip
                  title={<Typography>API Key</Typography>}
                  placement="top"
                >
                  <TextField
                    fullWidth
                    label={"API Key"}
                    value={editedPlugin.apiKey}
                    onChange={(e) => {
                      onChange("apiKey", e.target.value);
                      setEndpointSuccess(false);
                    }}
                  />
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
      <TestEndpointModal
        open={testEndpointModal}
        handleClose={handleCloseTestEndpoint}
        yamlString={yamlString}
        setEndpointSuccess={setEndpointSuccess}
        path={editedPlugin.path}
        apiKey={editedPlugin.apiKey}
      />
    </Box>
  );
};

export default PluginDetailTableEdit;
