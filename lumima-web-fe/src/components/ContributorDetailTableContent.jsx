import { Box, Divider, Typography } from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import { tokens } from "../theme";

const ContributorDetailTableContent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="100%">
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Username
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Jesslyn
          </Typography>
        </Grid>
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Domain
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Developer
          </Typography>{" "}
        </Grid>
        <Grid item size={12}>
          <Divider />
        </Grid>
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Last Online
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            23 minutes ago
          </Typography>
        </Grid>
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Joined
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            16 September 2024
          </Typography>
        </Grid>
        <Grid item size={12}>
          <Divider />
        </Grid>
        <Grid item size={12}>
          <Typography variant="body1" color={colors.grey[700]}>
            Email Address
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            LEEH0023@e.ntu.edu.sg
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContributorDetailTableContent;
