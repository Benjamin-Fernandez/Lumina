import { useEffect, useState } from "react";
import { Box, Button, Typography, IconButton, Avatar } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../../theme";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PluginDetailTableSidebar from "../../../components/plugin/pluginDetail/PluginDetailTableSidebar";
import PluginDetailTableContent from "../../../components/plugin/pluginDetail/PluginDetailTableContent";
import EditIcon from "@mui/icons-material/Edit";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import DeactivateModal from "../../../components/modal/DeactivateModal";
import CancelModal from "../../../components/modal/CancelModal";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import BlockIcon from "@mui/icons-material/Block";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../config/axiosConfig";
import Loading from "../../global/Loading";
import ActivateModal from "../../../components/modal/ActivateModal";
import { ToastContainer, toast } from "react-toastify";
import * as yaml from "js-yaml";
import DeleteModal from "../../../components/modal/DeleteModal";

const PluginDetailsDev = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const Navigate = useNavigate();

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState("details");
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [plugin, setPlugin] = useState(null);
  const [editedPlugin, setEditedPlugin] = useState(plugin || {});
  const [endpointSuccess, setEndpointSuccess] = useState(true);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const successToastify = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
    });
  };

  const errorToastify = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
    });
  };
  // Function to handle sidebar navigation
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleOpenDeactivate = () => {
    setDeactivateModal(true);
  };
  const handleCloseDeactivate = () => {
    setDeactivateModal(false);
  };
  const handleOpenActivate = () => {
    setActivateModal(true);
  };
  const handleCloseActivate = () => {
    setActivateModal(false);
  };
  const handleOpenCancel = () => {
    setCancelModal(true);
  };
  const handleCloseCancel = () => {
    setEdit(false);
    setCancelModal(false);
  };
  const handleOpenDelete = () => {
    setDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setDeleteModal(false);
  };
  const handleBackCancel = () => {
    setCancelModal(false);
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  const generateYaml = ({
    name,
    endpoint,
    path,
    requestFormat,
    requestContentType,
    requestBodyQueryKey,
  }) => {
    let yamlObject = {};
    if (requestFormat == "application/json") {
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
      // Convert the JavaScript object to a YAML string
      const yamlString = yaml.dump(yamlObject);

      return yamlString;
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
  };

  const handlePluginChange = (field, value) => {
    setEditedPlugin({ ...editedPlugin, [field]: value });
  };

  const handleDeactivate = () => {
    axios
      .put(`/plugin/${id}`, { activated: false })
      .then(() => {
        setDeactivateModal(false);
        setPlugin({ ...plugin, activated: false });
        successToastify("Plugin deactivated successfully");
      })
      .catch((err) => {
        console.log(err);
        errorToastify("Error deactivating plugin: " + err);
      });
  };
  const handleActivate = () => {
    axios
      .put(`/plugin/${id}`, { activated: true })
      .then(() => {
        setActivateModal(false);
        setPlugin({ ...plugin, activated: true });
        successToastify("Plugin activated successfully");
      })
      .catch((err) => {
        console.log(err);
        errorToastify("Error activating plugin: " + err);
      });
  };
  const handleDelete = () => {
    axios
      .delete(`/plugin/${id}`)
      .then(() => {
        setDeleteModal(false);
        successToastify("Plugin deleted successfully");
        Navigate("/pluginDev");
      })
      .catch((err) => {
        console.log(err);
        errorToastify("Error deleting plugin: " + err);
      });
  };

  const handleDone = () => {
    console.log(editedPlugin);
    const yamlString = generateYaml({
      name: editedPlugin.name,
      endpoint: editedPlugin.endpoint,
      path: editedPlugin.path,
      requestFormat: editedPlugin.requestFormat,
      requestContentType: editedPlugin.requestContentType,
      requestBodyQueryKey: editedPlugin.requestBodyQueryKey,
    });
    console.log(yamlString);
    axios
      .put(`/plugin/${id}`, {
        name: editedPlugin.name,
        version: editedPlugin.version,
        image: editedPlugin.image,
        category: editedPlugin.category,
        description: editedPlugin.description,
        activated: editedPlugin.activated,
        schema: yamlString,
        endpoint: editedPlugin.endpoint,
        path: editedPlugin.path,
        requestBodyQueryKey: editedPlugin.requestBodyQueryKey,
        requestFormat: editedPlugin.requestFormat,
        requestContentType: editedPlugin.requestContentType,
        responseStatusCode: editedPlugin.responseStatusCode,
        responseFormat: editedPlugin.responseFormat,
        responseBodyKey: editedPlugin.responseBodyKey,
      })
      .then(() => {
        setEdit(false);
        setPlugin(editedPlugin);
        successToastify("Plugin updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchPlugin = async () => {
    const response = await axios.get(`/plugin/${id}`);
    setPlugin(response.data.plugin);
    setEditedPlugin(response.data.plugin);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlugin();
  }, []);
  return (
    <>
      {loading ? (
        <Box
          px={4}
          mx={4}
          height="80vh"
          width="95%"
          border={1}
          borderRadius={2}
          borderColor={colors.grey[800]}
          display="flex"
          flexDirection="column"
        >
          <Loading />
        </Box>
      ) : (
        <Box
          px={4}
          mx={4}
          height="80vh"
          width="95%"
          border={1}
          borderRadius={2}
          borderColor={colors.grey[800]}
          display="flex"
          flexDirection="column"
        >
          <ToastContainer />
          <Box
            height="30%"
            width="100%"
            borderBottom={1}
            borderColor={colors.grey[800]}
            py={4}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="row">
              {!edit && (
                <Box
                  component="img"
                  src={plugin?.image}
                  sx={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                />
              )}

              <Box display="flex" flexDirection="column">
                <Typography
                  variant="h4"
                  sx={{ mx: "20px", my: "20px" }}
                  fontWeight="bold"
                >
                  {plugin?.name}
                </Typography>
                <Typography variant="h6" sx={{ mx: "20px", mb: "10px" }}>
                  {plugin?.userName}
                </Typography>
                <Typography variant="h6" sx={{ mx: "20px" }}>
                  {plugin?.userEmail}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row">
              {!edit && (
                <Button
                  variant="contained"
                  sx={{
                    padding: "8px 16px", // Adjust padding to hug content
                    alignSelf: "flex-end", // Position the button at the bottom of the Box
                    textTransform: "none",
                    fontSize: "13px",
                    borderRadius: 2,
                    mr: 2,
                    bgcolor: colors.yellowAccent[500],
                  }}
                  onClick={handleEdit}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
              )}
              {edit && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    padding: "8px 16px", // Adjust padding to hug content
                    alignSelf: "flex-end", // Position the button at the bottom of the Box
                    textTransform: "none",
                    fontSize: "13px",
                    borderRadius: 2,
                    mr: 2,
                  }}
                  onClick={handleDone}
                  startIcon={<DoneIcon />}
                  disabled={
                    !endpointSuccess ||
                    !editedPlugin.name ||
                    !editedPlugin.version ||
                    !editedPlugin.image ||
                    !editedPlugin.category ||
                    !editedPlugin.description ||
                    !editedPlugin.schema ||
                    !editedPlugin.endpoint ||
                    !editedPlugin.path
                  }
                >
                  Done
                </Button>
              )}
              {!edit && plugin.activated && (
                <Button
                  variant="contained"
                  sx={{
                    padding: "8px 16px", // Adjust padding to hug content
                    alignSelf: "flex-end", // Position the button at the bottom of the Box
                    textTransform: "none",
                    fontSize: "13px",
                    borderRadius: 2,
                    mr: 2,
                    bgcolor: colors.blueAccent[500],
                  }}
                  onClick={handleOpenDeactivate}
                  startIcon={<BlockIcon />}
                >
                  Deactivate
                </Button>
              )}

              {!edit && !plugin.activated && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    padding: "8px 16px", // Adjust padding to hug content
                    alignSelf: "flex-end", // Position the button at the bottom of the Box
                    textTransform: "none",
                    fontSize: "13px",
                    borderRadius: 2,
                    mr: 2,
                  }}
                  onClick={handleOpenActivate}
                  startIcon={<RocketLaunchOutlinedIcon />}
                >
                  Activate
                </Button>
              )}
              {!edit && (
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    padding: "8px 16px", // Adjust padding to hug content
                    alignSelf: "flex-end", // Position the button at the bottom of the Box
                    textTransform: "none",
                    fontSize: "13px",
                    borderRadius: 2,
                  }}
                  onClick={handleOpenDelete}
                  startIcon={<DeleteOutlineOutlinedIcon />}
                >
                  Delete
                </Button>
              )}
              {edit && (
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    padding: "8px 16px", // Adjust padding to hug content
                    alignSelf: "flex-end", // Position the button at the bottom of the Box
                    textTransform: "none",
                    fontSize: "13px",
                    borderRadius: 2,
                  }}
                  onClick={handleOpenCancel}
                  startIcon={<CloseIcon />}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>

          <Box display="flex" flexDirection="row" py={4}>
            <PluginDetailTableSidebar
              selectedSection={selectedSection}
              handleSectionClick={handleSectionClick}
            />
            <PluginDetailTableContent
              selectedSection={selectedSection}
              edit={edit}
              plugin={plugin}
              editedPlugin={editedPlugin}
              onChange={handlePluginChange}
              setEndpointSuccess={setEndpointSuccess}
            />
          </Box>
          <DeactivateModal
            open={deactivateModal}
            handleClose={handleCloseDeactivate}
            onDeactivate={handleDeactivate}
          />
          <ActivateModal
            open={activateModal}
            handleClose={handleCloseActivate}
            onActivate={handleActivate}
          />
          <CancelModal
            open={cancelModal}
            handleClose={handleCloseCancel}
            handleBack={handleBackCancel}
          />
          <DeleteModal
            open={deleteModal}
            handleClose={handleCloseDelete}
            onDelete={handleDelete}
          />
        </Box>
      )}
    </>
  );
};

export default PluginDetailsDev;
