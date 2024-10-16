import { Box, Divider, Typography } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../theme";

const DashboardTableRows = ({ title, author, version, size, status }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box justifyContent="center">
      <Divider sx={{ marginY: "10px" }} />
      <Grid container spacing={2} alignItems="center">
        <Grid item size={4}>
          <Typography variant="body1">{title}</Typography>
        </Grid>
        <Grid item size={2}>
          <Typography variant="body1">{author}</Typography>
        </Grid>
        <Grid item size={2}>
          <Typography variant="body1">{version}</Typography>
        </Grid>
        <Grid item size={2}>
          <Typography variant="body1">{size}</Typography>
        </Grid>
        <Grid item size={2}>
          <Box>
            <Typography
              variant="body1"
              bgcolor={colors.blueAccent[900]}
              color={colors.blueAccent[300]}
              borderRadius={2}
              width="fit-content"
              p={1}
            >
              {status}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardTableRows;
