import React from "react";
import { Box, Divider, Typography, Link } from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PluginDetailTableEdit from "./PluginDetailTableEdit";
import IconButton from "@mui/material/IconButton";
import { tokens } from "../../../theme";
import PluginDetailTableNoEdit from "./PluginDetailTableNoEdit";

const PluginDetailTableContent = ({
  selectedSection,
  edit,
  plugin,
  editedPlugin,
  onChange,
  setEndpointSuccess,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <Box width="100%" height="50vh" pl={3} py={1}>
      {edit && (
        <PluginDetailTableEdit
          selectedSection={selectedSection}
          editedPlugin={editedPlugin}
          onChange={handleFieldChange}
          setEndpointSuccess={setEndpointSuccess}
        />
      )}
      {!edit && (
        <PluginDetailTableNoEdit
          selectedSection={selectedSection}
          plugin={plugin}
        />
      )}
    </Box>
  );
};

export default PluginDetailTableContent;
