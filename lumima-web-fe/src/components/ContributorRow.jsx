import { Box, Divider, Typography, Button } from "@mui/material";
import { Grid, textTransform, useTheme } from "@mui/system";
import { tokens } from "../theme";

const ContributorRow = ({ name, domain, lastOnline, joined }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box justifyContent="center">
      <Grid container spacing={2} alignItems="center">
        <Grid item size={4}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {domain}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {lastOnline}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {joined}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none", fontSize: "13px" }}
          >
            TODO
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContributorRow;
