import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Paper,
  Badge,
  Tooltip,
  Switch,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import DoneAllIcon from "@mui/icons-material/DoneAll";

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
  backgroundColor: isOwn ? "#1976d2" : "#f5f5f5",
  color: isOwn ? "#ffffff" : "#000000",
}));

const TestEndpoint = () => {
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
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
                {message.isOwn && (
                  <DoneAllIcon
                    style={{ opacity: message.status === "read" ? 1 : 0.5 }}
                  />
                )}
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
  );
};

export default TestEndpoint;
