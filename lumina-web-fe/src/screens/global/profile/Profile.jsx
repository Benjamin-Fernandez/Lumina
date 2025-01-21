import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../../theme";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ContributorDetailTableContent from "../../../components/contributor/ContributorDetailTableContent";
import LogOutModal from "../../../components/modal/LogOutModal";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../../config/axiosConfig";
import Loading from "../Loading";
import { useMsal } from "@azure/msal-react";

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [logoutModal, setLogoutModal] = useState(false);
  const email = useMsal().instance.getActiveAccount()?.username;
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const handleOpenLogout = () => {
    setLogoutModal(true);
  };
  const handleCloseLogout = () => {
    setLogoutModal(false);
  };

  useEffect(() => {
    axios
      .get("/user/email/" + email)
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user by email:", error);
      });
  }, []);

  return loading ? (
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
      <Loading />
    </Box>
  ) : (
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
      <Box display="flex" flexDirection="row">
        <ContributorDetailTableContent user={user} />
      </Box>
      <Button
        sx={{
          bgcolor: colors.redAccent[500],
          width: "100%",
          padding: "8px 16px", // Adjust padding to hug content
          alignSelf: "flex-end", // Position the button at the bottom of the Box
          textTransform: "none",
          fontSize: "13px",
          color: "white",
          borderRadius: 2,
          mt: 4,
        }}
        onClick={handleOpenLogout}
        startIcon={<LogoutOutlinedIcon />}
      >
        Logout
      </Button>
      <LogOutModal open={logoutModal} handleClose={handleCloseLogout} />
    </Box>
  );
};

export default Profile;
