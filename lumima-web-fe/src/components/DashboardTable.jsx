import { Box, Divider, Typography } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../theme";
import DashboardRow from "./DashboardRow";

const DashboardTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      py={4}
      px={4}
      my={4}
      height="100%"
      width="100%"
      border={1}
      borderRadius={2}
      borderColor={colors.grey[800]}
    >
      <Typography variant="h4" fontWeight="bold">
        Plugins Overview
      </Typography>
      <Grid container spacing={2} mb="15px">
        {/* Table headers */}
        <Grid item size={4} mt={3}>
          <Typography variant="body1">Plugin Title</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Author</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Version</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Size</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Status</Typography>
        </Grid>
      </Grid>
      {/* Table data */}
      <DashboardRow
        title="Plugin 1"
        author="Author 1"
        version="1.0.0"
        size="1MB"
        status="Approved"
      />
      <DashboardRow
        title="Plugin 2"
        author="Author 2"
        version="1.0.0"
        size="1MB"
        status="Approved"
      />
    </Box>
  );
};

export default DashboardTable;
