import { Box, Typography } from "@mui/material";

{
  /**
   * 1. Approval requests
   * 2. Update requests
   * 3. Deployed successful
   * 4. Deployed failed
   */
}

const NotificationRow = ({ notificationType, author, chatbot }) => {
  return (
    <Box display="flex" flexDirection="row" pb={3}>
      <Box
        component="img"
        src={"/assets/chatbot.jpg"}
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
        }}
      />
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Typography
          variant="h6"
          sx={{ mx: "20px", mt: "0", mb: "0" }} // Only horizontal margin
          fontWeight="bold"
        >
          New Plug-in Approval Request
        </Typography>
        <Typography variant="body1" sx={{ mx: "20px", mt: "0", mb: "0" }}>
          {author} has sent a plug-in approval request for "{chatbot}".
        </Typography>
      </Box>
    </Box>
  );
};

export default NotificationRow;
