import React, { createContext, useContext, useState } from "react";

// createContext --> create an instance of Context API that other components can read
const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [favouriteChatbots, setFavouriteChatbots] = useState([]);
  const [discoverChatbots, setDiscoverChatbots] = useState([]);

  return (
    <ChatbotContext.Provider
      value={{
        favouriteChatbots,
        setFavouriteChatbots,
        discoverChatbots,
        setDiscoverChatbots,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);
