import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import NotificationRow from "../../components/notification/NotificationRow";

const Notification = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
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
      <NotificationRow
        notificationType="approval"
        author="LEEH0023"
        chatbot="SC1015 chatbot"
      />
      <Divider />
    </Box>
  );
};

export default Notification;
