import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import { colors } from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import IconButton from "@mui/material/IconButton";
import { tokens } from "../../../theme";

const PluginDetailTableContent = ({ selectedSection }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="70%" pl={3}>
      {selectedSection === "metadata" && (
        <Grid container spacing={2} mb="15px">
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Plugin Name
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              SC1015 Chatbot
            </Typography>
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Version
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              1.0.0
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
              Modules
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
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit
              optio sequi cum cumque dicta laudantium molestias quia libero
              laborum architecto quos quasi, saepe, a doloremque omnis iusto
              tenetur reiciendis ullam modi, magnam exercitationem. Asperiores
              at animi sit magni sunt iusto.
            </Typography>
          </Grid>
        </Grid>
      )}
      {selectedSection === "capabilities" && (
        <Grid container spacing={2} mb="15px">
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Schema
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde nam
              explicabo atque hic amet minus maxime, voluptatibus minima soluta
              perspiciatis doloribus ipsum iste officia. Quibusdam commodi,
              quisquam amet cumque aliquid repellendus, laborum reprehenderit
              sint possimus, error cupiditate deleniti praesentium fugit.
            </Typography>
          </Grid>
          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={6}>
            <Typography variant="body1" color={colors.grey[700]}>
              Authentication
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              OAuth
            </Typography>{" "}
          </Grid>
          <Grid item size={12}>
            <Divider />
          </Grid>
          <Grid item size={12}>
            <Typography variant="body1" color={colors.grey[700]}>
              Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={4}>
                <Typography
                  variant="body1"
                  sx={{ mt: 2 }}
                  color={colors.grey[700]}
                >
                  Name
                </Typography>
              </Grid>
              <Grid item size={4}>
                <Typography
                  variant="body1"
                  sx={{ mt: 2 }}
                  color={colors.grey[700]}
                >
                  Method
                </Typography>
              </Grid>
              <Grid item size={4}>
                <Typography
                  variant="body1"
                  sx={{ mt: 2 }}
                  color={colors.grey[700]}
                >
                  Path
                </Typography>
              </Grid>
            </Grid>
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

export default PluginDetailTableContent;
