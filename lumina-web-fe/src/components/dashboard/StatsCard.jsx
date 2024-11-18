import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";

const StatsCard = ({ title, value, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="start"
      justifyContent="start"
      px={3}
      py={3}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: colors.grey[800],
        width: "100%",
        height: "auto", // Adjust the height as needed
      }}
    >
      <Box display="flex" alignItems="center">
        {icon}
        <Typography variant="h5" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" fontWeight="bold" mb={2} mt={2}>
        {value}
      </Typography>
      <Box width="100%" py={1}>
        <Typography variant="body1" color="textSecondary">
          Updated: 2 days ago
        </Typography>
      </Box>
    </Box>
  );
};

export default StatsCard;
