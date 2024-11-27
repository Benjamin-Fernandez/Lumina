import { Box, Divider, Typography } from "@mui/material";
import { useTheme, Grid } from "@mui/system";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { useUser } from "../../context/UserContext";

const ContributorDetailTableContent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { email } = useUser();
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get("/user/email/" + email)
      .then((res) => {
        setUser(res.data.user);
        console.log("User details:", res.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user by email:", error);
      });
  }, []);

  return (
    <Box width="100%" height="100%">
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Username
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {user.name}
          </Typography>
        </Grid>
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Domain
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {user.domain}
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
            {new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Grid>
        <Grid item size={6}>
          <Typography variant="body1" color={colors.grey[700]}>
            Email Address
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {user.email}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContributorDetailTableContent;
