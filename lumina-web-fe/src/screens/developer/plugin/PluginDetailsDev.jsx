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
import { useParams } from "react-router-dom";
import axios from "../../../config/axiosConfig";
import Loading from "../../global/Loading";
import ActivateModal from "../../../components/modal/ActivateModal";

const PluginDetailsDev = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState("details");
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [plugin, setPlugin] = useState(null);
  const [editedPlugin, setEditedPlugin] = useState(plugin || {});
  const [endpointSuccess, setEndpointSuccess] = useState(true);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

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
  const handleBackCancel = () => {
    setCancelModal(false);
  };

  const handleEdit = () => {
    setEdit(!edit);
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleActivate = () => {
    axios
      .put(`/plugin/${id}`, { activated: true })
      .then(() => {
        setActivateModal(false);
        setPlugin({ ...plugin, activated: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDone = () => {
    axios
      .put(`/plugin/${id}`, {
        name: editedPlugin.name,
        version: editedPlugin.version,
        image: editedPlugin.image,
        category: editedPlugin.category,
        description: editedPlugin.description,
        activated: editedPlugin.activated,
        schema: editedPlugin.schema,
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
                  disabled={!endpointSuccess}
                >
                  Done
                </Button>
              )}
              {!edit && plugin.activated && (
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
                  onClick={handleOpenDeactivate}
                  startIcon={<DeleteOutlineOutlinedIcon />}
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
                  }}
                  onClick={handleOpenActivate}
                  startIcon={<RocketLaunchOutlinedIcon />}
                >
                  Activate
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
        </Box>
      )}
    </>
  );
};

export default PluginDetailsDev;
