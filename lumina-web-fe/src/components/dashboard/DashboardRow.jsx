import { Box, Divider, Typography } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../../theme";

const DashboardRow = ({
  title,
  author,
  version,
  size,
  category,
  displayPic,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box justifyContent="center">
      <Divider sx={{ marginY: "10px" }} />
      <Grid container spacing={2} alignItems="center">
        <Grid
          item
          size={4}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Box
            component="img"
            src={displayPic}
            width={40}
            height={40}
            borderRadius="50%"
            mr={1}
          />
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
          <Typography variant="body1">{category}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardRow;
