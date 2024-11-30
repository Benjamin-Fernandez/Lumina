import React from "react";
import { Box, Divider, Typography, Link } from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PluginDetailTableEdit from "./PluginDetailTableEdit";
import IconButton from "@mui/material/IconButton";
import { tokens } from "../../../theme";

const PluginDetailTableNoEdit = ({ selectedSection, plugin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="50vh" pl={3} sx={{ overflowY: "auto" }}>
      {selectedSection === "details" && (
        <Grid container spacing={2} mb="15px">
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Plugin Name
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.name}
            </Typography>
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Version
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.version}
            </Typography>{" "}
          </Grid>
          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Date of Launch
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              9 September 2024
            </Typography>
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Category
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.category}
            </Typography>
          </Grid>
          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.description}
            </Typography>
          </Grid>
        </Grid>
      )}
      {selectedSection === "endpoints" && (
        <Grid container spacing={2} mb="15px">
          {/* <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              OpenAPI 3.0 Schema
            </Typography>
            <Link
              // href={URL.createObjectURL(yamlFile)}
              // download={yamlFile.name}
              alignSelf="center"
              sx={{ mt: 2 }}
            >
              yamlFile
            </Link>
          </Grid> */}
          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Server URL
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.endpoint}
            </Typography>
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Path
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.path}
            </Typography>
          </Grid>

          <Grid item size={12}>
            <Divider />
          </Grid>

          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Request Body
            </Typography>
          </Grid>

          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Request Format
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.requestFormat}
            </Typography>
          </Grid>

          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Request Body Content Type
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.requestContentType}
            </Typography>
          </Grid>
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Request Body Query Key
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.requestBodyQueryKey}
            </Typography>
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
            <Typography variant="body1" color={colors.grey[700]}>
              Response Status Code
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.responseStatusCode}
            </Typography>
          </Grid>

          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Response Format
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.responseFormat}
            </Typography>
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Response Body Key
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {plugin?.responseBodyKey}
            </Typography>
          </Grid>
        </Grid>
      )}

      {selectedSection === "documents" && (
        <Grid container spacing={2} mb="15px" mr={2}>
          <Grid item size={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex" // Make this a flex container
                alignItems="center" // Center items vertically
                border={1}
                borderColor={colors.grey[800]}
                borderRadius={2}
                sx={{
                  textTransform: "none",
                  fontSize: "14px",
                  p: 1,
                  maxWidth: "100%",
                }}
              >
                <Typography
                  sx={{
                    flexGrow: 1, // Allow the typography to grow and take available space
                    maxWidth: "70%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  SC1015_Course_Syllabus.pdfduewgfiufgeiufg
                </Typography>

                <IconButton
                  onClick={() => {
                    /* Handle click for first icon */
                  }}
                  sx={{ color: colors.grey[800], ml: 1 }} // Use appropriate color from your theme
                >
                  <VisibilityOutlinedIcon />
                </IconButton>

                {/* Second Icon Button */}
                <IconButton
                  onClick={() => {
                    /* Handle click for second icon */
                  }}
                  sx={{ color: colors.grey[800] }} // Add left margin for spacing
                >
                  <FileDownloadOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid item size={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex" // Make this a flex container
                alignItems="center" // Center items vertically
                border={1}
                borderColor={colors.grey[800]}
                borderRadius={2}
                sx={{
                  textTransform: "none",
                  fontSize: "14px",
                  p: 1,
                  maxWidth: "100%",
                }}
              >
                <Typography
                  sx={{
                    flexGrow: 1, // Allow the typography to grow and take available space
                    maxWidth: "70%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  SC1015_Course_Syllabus.pdfduewgfiufgeiufg
                </Typography>

                <IconButton
                  onClick={() => {
                    /* Handle click for first icon */
                  }}
                  sx={{ color: colors.grey[800], ml: 1 }} // Use appropriate color from your theme
                >
                  <VisibilityOutlinedIcon />
                </IconButton>

                {/* Second Icon Button */}
                <IconButton
                  onClick={() => {
                    /* Handle click for second icon */
                  }}
                  sx={{ color: colors.grey[800] }} // Add left margin for spacing
                >
                  <FileDownloadOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid item size={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex" // Make this a flex container
                alignItems="center" // Center items vertically
                border={1}
                borderColor={colors.grey[800]}
                borderRadius={2}
                sx={{
                  textTransform: "none",
                  fontSize: "14px",
                  p: 1,
                  maxWidth: "100%",
                }}
              >
                <Typography
                  sx={{
                    flexGrow: 1, // Allow the typography to grow and take available space
                    maxWidth: "70%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  SC1015_Course_Syllabus.pdfduewgfiufgeiufg
                </Typography>

                <IconButton
                  onClick={() => {
                    /* Handle click for first icon */
                  }}
                  sx={{ color: colors.grey[800], ml: 1 }} // Use appropriate color from your theme
                >
                  <VisibilityOutlinedIcon />
                </IconButton>

                {/* Second Icon Button */}
                <IconButton
                  onClick={() => {
                    /* Handle click for second icon */
                  }}
                  sx={{ color: colors.grey[800] }} // Add left margin for spacing
                >
                  <FileDownloadOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PluginDetailTableNoEdit;
