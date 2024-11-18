import { Box, Typography } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import DashboardRow from "./DashboardRow";
import pluginData from "../../data/pluginData";

const DashboardTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const latestPlugins = pluginData.slice(0, 5);

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
        Latest Plugins
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
          <Typography variant="body1">Category</Typography>
        </Grid>
      </Grid>
      {/* Table data */}
      {latestPlugins.map((plugin, index) => (
        <DashboardRow
          key={index}
          title={plugin.title}
          author={plugin.author}
          version={plugin.version}
          size={plugin.size}
          category={plugin.category}
          displayPic={plugin.displayPic}
        />
      ))}
    </Box>
  );
};

export default DashboardTable;
