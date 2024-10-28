import { useParams } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import SwitchAccessShortcutOutlinedIcon from "@mui/icons-material/SwitchAccessShortcutOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContributorDetailTableContent from "../../components/contributor/ContributorDetailTableContent";

const ContributorDetails = () => {
  const { id } = useParams();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      py={4}
      px={4}
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
          <Box display="flex" flexDirection="column">
            <Typography variant="h4" sx={{ my: "20px" }} fontWeight="bold">
              Contributor Information
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
            startIcon={<SwitchAccessShortcutOutlinedIcon />}
          >
            Promote
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
            startIcon={<LockResetOutlinedIcon />}
          >
            Reset Password
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
            Delete
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
        <ContributorDetailTableContent />
      </Box>
    </Box>
  );
};

export default ContributorDetails;
