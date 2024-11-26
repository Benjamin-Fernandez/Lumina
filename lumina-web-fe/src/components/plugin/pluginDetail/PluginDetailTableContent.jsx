import React from "react";
import { Box, Divider, Typography, Link } from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PluginDetailTableEdit from "./PluginDetailTableEdit";
import IconButton from "@mui/material/IconButton";
import { tokens } from "../../../theme";
import PluginDetailTableNoEdit from "./PluginDetailTableNoEdit";

const PluginDetailTableContent = ({ selectedSection, edit }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="50vh" pl={3} sx={{ overflowY: "auto" }}>
      {edit && <PluginDetailTableEdit selectedSection={selectedSection} />}
      {!edit && <PluginDetailTableNoEdit selectedSection={selectedSection} />}
    </Box>
  );
};

export default PluginDetailTableContent;
