import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../theme";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const PluginDetailTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState("details");

  // Function to handle sidebar navigation
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <Box
      py={2}
      px={2}
      mx={4}
      height="80%"
      width="95%"
      border={1}
      borderRadius={2}
      borderColor={colors.grey[800]}
      display="flex"
      flexDirection="column"
    >
      <Box
        height="20%"
        width="100%"
        borderBottom={1}
        borderColor={colors.grey[800]}
        pb={4}
        mb={4}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="row">
          <Box
            component="img"
            src={"/assets/chatbot.jpg"}
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
            }}
          />
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h4"
              sx={{ mx: "20px", my: "20px" }}
              fontWeight="bold"
            >
              Plugin Name
            </Typography>
            <Typography variant="h6" sx={{ mx: "20px", mb: "10px" }}>
              Author
            </Typography>
            <Typography variant="h6" sx={{ mx: "20px" }}>
              Author Email
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <Button
            sx={{
              bgcolor: colors.blueAccent[500],
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              color: "white",
              mr: 2,
              borderRadius: 2,
            }}
            startIcon={<TaskAltOutlinedIcon />}
          >
            Approve
          </Button>
          <Button
            sx={{
              bgcolor: colors.yellowAccent[500],
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              color: "white",
              mr: 2,
              borderRadius: 2,
            }}
            startIcon={<AddCommentOutlinedIcon />}
          >
            Follow-up
          </Button>
          <Button
            sx={{
              bgcolor: colors.redAccent[500],
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              color: "white",
              borderRadius: 2,
            }}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Deactivate
          </Button>
        </Box>
      </Box>

      {/* Sidebar */}
      <Box display="flex" flexDirection="row">
        <Box width="20%" height="100%" pr={2}>
          <Stack border={1} borderRadius={2} borderColor={colors.grey[800]}>
            <Button
              variant={selectedSection === "details" ? "contained" : "outlined"}
              onClick={() => handleSectionClick("details")}
              sx={{
                textTransform: "none",
                padding: "15px",
                fontSize: "14px",
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
              Metadata
            </Button>
            <Button
              variant={
                selectedSection === "settings" ? "contained" : "outlined"
              }
              onClick={() => handleSectionClick("settings")}
              sx={{
                textTransform: "none",
                padding: "15px",
                fontSize: "14px",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderRight: "1px solid",
                borderColor: colors.grey[800],
                border: "0",
                justifyContent: "flex-start",
                ...(selectedSection === "settings" && {
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
              Capabilities
            </Button>
            <Button
              variant={selectedSection === "logs" ? "contained" : "outlined"}
              onClick={() => handleSectionClick("logs")}
              sx={{
                textTransform: "none",
                padding: "15px",
                fontSize: "14px",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderRight: "1px solid",
                borderColor: colors.grey[800],
                border: "0",
                justifyContent: "flex-start",
                ...(selectedSection === "logs" && {
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
            </Button>
          </Stack>
        </Box>

        {/* Main content area */}
        <Box width="80%" height="100%" pl={3}>
          {selectedSection === "details" && (
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
                  tenetur reiciendis ullam modi, magnam exercitationem.
                  Asperiores at animi sit magni sunt iusto.
                </Typography>
              </Grid>
            </Grid>
          )}
          {selectedSection === "settings" && (
            <Grid container spacing={2} mb="15px">
              <Grid item size={12}>
                <Typography variant="body1" color={colors.grey[700]}>
                  Schema
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde
                  nam explicabo atque hic amet minus maxime, voluptatibus minima
                  soluta perspiciatis doloribus ipsum iste officia. Quibusdam
                  commodi, quisquam amet cumque aliquid repellendus, laborum
                  reprehenderit sint possimus, error cupiditate deleniti
                  praesentium fugit.
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
          {selectedSection === "logs" && (
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
      </Box>
    </Box>
  );
};

export default PluginDetailTable;
