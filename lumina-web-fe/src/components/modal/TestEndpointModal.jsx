import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import testEndpoint from "../../helpers/TestEndpoint";

const MessageContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#bdbdbd",
    borderRadius: "3px",
  },
});

const Message = styled(Box)(({ isOwn }) => ({
  display: "flex",
  justifyContent: isOwn ? "flex-end" : "flex-start",
  marginBottom: "10px",
}));

const MessageContent = styled(Box)(({ isOwn }) => ({
  maxWidth: "70%",
  padding: "12px 16px",
  borderRadius: "12px",
  backgroundColor: isOwn ? "#6870fa" : "#f5f5f5",
  color: isOwn ? "#ffffff" : "#000000",
}));

const TestEndpointModal = ({
  open,
  handleClose,
  yamlString,
  setEndpointSuccess,
  path,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Test your endpoint by sending a message!",
      isOwn: false,
    },
    {
      id: 2,
      text: "Once the model return a successful string response, it will be rendered here and the next button will be enabled for you to move on to deploy your plugin on Lumina Mobile.",
      isOwn: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        isOwn: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");

      console.log("YAML STRING before calling testEndpoint", yamlString);

      testEndpoint({ yamlString, query: newMessage, path })
        .then((response) => {
          console.log("RESPONSE IN TESTENDPOINT", response); // Resolved response
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: prevMessages.length + 1,
              text: response,
              isOwn: false,
            },
          ]);
          if (
            !response.includes("Error") &&
            response !== "No response from API."
          ) {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: prevMessages.length + 1,
                text: "Endpoint test successful! 🎉 You may proceed to review and submit your plugin.",
                isOwn: false,
              },
            ]);
            setEndpointSuccess(true);
          }
        })
        .catch((error) => {
          console.log("ERROR:", error); // Rejected error
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: prevMessages.length + 1,
              text: error,
              isOwn: false,
            },
          ]);
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3, // Adds border radius
          padding: 2, // Increases padding inside the dialog
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Test Endpoint
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" height="90%">
          <MessageContainer>
            {messages.map((message) => (
              <Message key={message.id} isOwn={message.isOwn}>
                <MessageContent isOwn={message.isOwn}>
                  <Typography>{message.text}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ mr: 1, opacity: 0.7 }}>
                      {message.time}
                    </Typography>
                  </Box>
                </MessageContent>
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </MessageContainer>

          <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", mt: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                variant="outlined"
                size="small"
                sx={{ mx: 1 }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!newMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.grey[800],
          }}
        >
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestEndpointModal;
