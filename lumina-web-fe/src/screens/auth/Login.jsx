import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { config } from "../../config";
import { PublicClientApplication } from "@azure/msal-browser";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleLogin = async () => {
    const msalConfig = {
      auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
      },
    };

    const msalInstance = new PublicClientApplication(msalConfig);

    try {
      // Ensure the instance is initialized
      await msalInstance.initialize();
      console.log("MSAL initialized successfully.");

      const loginRequest = {
        scopes: config.scopes,
        prompt: "login", // Forces credential prompt on login
      };

      // Proceed with the login popup
      const response = await msalInstance.loginPopup(loginRequest);
      console.log("Login successful:", response);
      if (response) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box
        width="60%"
        borderRadius={6}
        height="100vh"
        bgcolor={colors.blueAccent[900]}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        justifyItems="end"
      >
        <Box
          component="img"
          src={"/assets/Dashboard.png"}
          sx={{
            width: "85%",
            height: "80%",
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        />
      </Box>
      <Box
        width="35%"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        px={6}
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box
            component="img"
            src={"/assets/logo.png"}
            sx={{
              width: "60px",
              height: "60px",
            }}
          />
          <Typography variant="h2" ml="15px">
            Lumina Portal
          </Typography>
        </Box>
        <Box mt={4}>
          <Typography variant="h4" mb={2}>
            Welcome 👋!
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={2}>
            Lumina Portal is for NTU staffs and students to create plug-ins for
            Lumina Mobile. Please sign in with your NTU account to continue.
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            px: 4,
            py: 1,
            textTransform: "none",
            bgcolor: colors.blueAccent[500],
            fontSize: "14px",
            width: "100%",
          }}
          onClick={handleLogin}
        >
          Sign in with Outlook
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
