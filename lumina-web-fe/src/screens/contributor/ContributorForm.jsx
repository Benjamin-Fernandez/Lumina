import { Box, Button, Typography, Divider, TextField } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { useState } from "react";
import { tokens } from "../../theme";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const ContributorForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [domain, setDomain] = useState("");

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
              Add Contributor
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
            startIcon={<AddCircleOutlineIcon />}
          >
            Create
          </Button>
          <Button
            sx={{
              bgcolor: colors.grey[500],
              padding: "8px 16px", // Adjust padding to hug content
              alignSelf: "flex-end", // Position the button at the bottom of the Box
              textTransform: "none",
              fontSize: "13px",
              color: "white",
              mr: 2,
              borderRadius: 2,
            }}
            startIcon={<CancelOutlinedIcon />}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
        <Box width="100%" height="100%">
          <Grid container spacing={2} mb="15px">
            <Grid item size={6}>
              <TextField
                id="outlined-basic"
                label="Contributor Name"
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item size={6}>
              <FormControl fullWidth>
                <InputLabel id="domain">Domain</InputLabel>
                <Select
                  labelId="domain"
                  id="domain"
                  value={domain}
                  label="domain"
                  onChange={(e) => setDomain(e.target.value)}
                >
                  <MenuItem value={"Developer"}>Developer</MenuItem>
                  <MenuItem value={"Admin"}>Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={12}>
              <TextField
                id="outlined-basic"
                label="Email Address"
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ContributorForm;
