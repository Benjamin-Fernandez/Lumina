import { Box, Divider, Typography } from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import { tokens } from "../../theme";

const ContributorDetailTableContent = (user) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="100%">
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Name
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {user.user.name}
          </Typography>
        </Grid>
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Domain
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {user.user.domain}
          </Typography>{" "}
        </Grid>
        <Grid item size={12}>
          <Divider />
        </Grid>

        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Joined
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {new Date(user.user.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Grid>
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Email
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {user.user.email}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContributorDetailTableContent;
