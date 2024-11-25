import React from "react";
import { Box, Button, Stack } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/system";

const PluginDetailTableSidebar = ({ selectedSection, handleSectionClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" flexDirection="row">
      <Box width="100%" height="70%" pr={2}>
        <Stack border={1} borderRadius={2} borderColor={colors.grey[800]}>
          <Button
            variant={selectedSection === "details" ? "contained" : "outlined"}
            onClick={() => handleSectionClick("details")}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              paddingY: 2,
              paddingRight: 8,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderRight: "1px solid",
              borderColor: colors.grey[800],
              border: "0",
              justifyContent: "flex-start",
              ...(selectedSection === "details" && {
                backgroundColor: colors.blueAccent[400],
              }),

              // Focus state (when the button is focused)
              "&:focus": {
                outline: "none", // Remove focus outline
                backgroundColor: colors.blueAccent[400], // Focus background color
              },
              // Active state (when button is pressed)
              "&:active": {
                backgroundColor: colors.blueAccent[400], // Active background color
              },
            }}
            startIcon={<InfoIcon />}
          >
            Details
          </Button>
          <Button
            variant={selectedSection === "endpoints" ? "contained" : "outlined"}
            onClick={() => handleSectionClick("endpoints")}
            sx={{
              textTransform: "none",
              paddingY: 2,
              paddingRight: 8,
              fontSize: "14px",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              // borderBottomLeftRadius: 0,
              // borderBottomRightRadius: 0,
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderRight: "1px solid",
              borderColor: colors.grey[800],
              border: "0",
              justifyContent: "flex-start",
              ...(selectedSection === "endpoints" && {
                backgroundColor: colors.blueAccent[400],
              }),

              // Focus state (when the button is focused)
              "&:focus": {
                outline: "none", // Remove focus outline
                backgroundColor: colors.blueAccent[400], // Focus background color
              },
              // Active state (when button is pressed)
              "&:active": {
                backgroundColor: colors.blueAccent[400], // Active background color
              },
            }}
            startIcon={<DiamondOutlinedIcon />}
          >
            Endpoints
          </Button>
          {/* <Button
            variant={selectedSection === "documents" ? "contained" : "outlined"}
            onClick={() => handleSectionClick("documents")}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              paddingY: 2,
              paddingRight: 8,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderRight: "1px solid",
              borderColor: colors.grey[800],
              border: "0",
              justifyContent: "flex-start",
              ...(selectedSection === "documents" && {
                backgroundColor: colors.blueAccent[400],
              }),

              // Focus state (when the button is focused)
              "&:focus": {
                outline: "none", // Remove focus outline
                backgroundColor: colors.blueAccent[400], // Focus background color
              },
              // Active state (when button is pressed)
              "&:active": {
                backgroundColor: colors.blueAccent[400], // Active background color
              },
            }}
            startIcon={<DescriptionOutlinedIcon />}
          >
            Documents
          </Button> */}
        </Stack>
      </Box>
    </Box>
  );
};

export default PluginDetailTableSidebar;
