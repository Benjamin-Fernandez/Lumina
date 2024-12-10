import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useLocalSearchParams, router } from "expo-router";
import { useUser } from "../../context/UserContext";
import axios from "../../config/axiosConfig";
import Markdown from "react-native-markdown-display";

const ChatScreen = ({ navigation }) => {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]); // Start with zero messages
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(params.id); // Get conversation ID from params
  const [chatbotId, setChatbotId] = useState(params.chatbotId);
  const [chatbot, setChatbot] = useState({});
  const [loading, setLoading] = useState(true);
  const { email } = useUser(); // Get email from context
  const scrollViewRef = useRef(null);

  const fetchConversation = async () => {
    try {
      const response = await axios.get(
        "message/conversation/" + conversationId
      );
      console.log("Messages fetched from the database: ", response.data);

      // Assuming response.data contains the array of message objects
      const messages = response.data;

      // Set the messages directly to the state
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatbot = async () => {
    try {
      const response = await axios.get("/chatbot/" + chatbotId);
      console.log("Chatbot details:", response.data);
      setChatbot(response.data.chatbot);
    } catch (error) {
      console.error("Error fetching chatbot details:", error);
    }
  };

  // Fetch messages on initial render
  React.useEffect(() => {
    console.log("Conversation ID: ", conversationId);
    console.log("params: ", params);
    if (chatbotId !== "0") {
      fetchChatbot();
    }
    if (conversationId !== "new") {
      fetchConversation();
    } else {
      setLoading(false);
    }
  }, []);

  const getResponse = useCallback(async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: "Fetching response...",
        fromSelf: false,
      },
    ]);

    if (chatbotId === "0") {
      // If the chatbot is Lumina GPT-4o
      console.log("Getting response from OpenAI...");
      console.log("Messages: ", messages);

      const response = await axios.post("/openai", {
        messages: messages,
      });

      console.log(
        "Response from OpenAI: ",
        response.data.response.choices[0].message.content
      );

      // Post the message to the backend
      await axios.post("/message", {
        conversationId: conversationId,
        fromSelf: false,
        content: response.data.response.choices[0].message.content,
      });

      // Update messages using the functional form to ensure the most up-to-date state is used
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1 &&
          msg.content === "Fetching response..."
            ? {
                ...msg,
                content: response.data.response.choices[0].message.content,
              }
            : msg
        )
      );

      console.log("Conversation updated: ", conversationId);
      await axios.put("/conversation/" + conversationId, {
        lastMessage: response.data.response.choices[0].message.content,
      });
      return response.data;
    } else {
      console.log(
        "Getting response from Custom Chatbot..., schema: ",
        chatbot.schema
      );
      try {
        const response = await axios.post("/custom", {
          message: messages[messages.length - 1].content,
          schema: chatbot.schema,
        });
        console.log("Response from Custom Chatbot: ", response.data.response);

        // Post the message to the backend
        await axios.post("/message", {
          conversationId: conversationId,
          fromSelf: false,
          content: response.data.response,
        });

        // Update messages using the functional form to ensure the most up-to-date state is used
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1 &&
            msg.content === "Fetching response..."
              ? {
                  ...msg,
                  content: response.data.response,
                }
              : msg
          )
        );

        console.log("Conversation updated: ", conversationId);
        await axios.put("/conversation/" + conversationId, {
          lastMessage: response.data.response,
        });
        return response.data.response;
      } catch (error) {
        console.error("Error fetching response from custom chatbot:", error);
      }
    }
  }, [messages, conversationId]);

  React.useEffect(() => {
    console.log("Messages: ", messages);
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.fromSelf) {
        // Get a response only if the last message was from the user
        getResponse();
      }
    }
  }, [messages, getResponse]);
  // Handle sending a message
  const handleSend = async () => {
    console.log("Sending message: ", input);
    if (input.trim()) {
      if (messages.length === 0) {
        try {
          const res = await axios.post("conversation/", {
            userEmail: email,
            chatbotId: chatbotId,
            firstMessage: input,
          });
          setConversationId(res.data.conversation._id);
          const currentConversationId = res.data.conversation._id;

          const messageRes = await axios.post("/message", {
            conversationId: currentConversationId,
            fromSelf: true,
            content: input,
          });
        } catch (error) {
          console.error("Error occurred:", error);
          // Handle the error gracefully (e.g., show a user-friendly message)
        }
      } else {
        console.log("Conversation exists: ", conversationId);
        await axios.post("/message", {
          conversationId: conversationId,
          fromSelf: true,
          content: input,
        });
      }
      setMessages([...messages, { content: input, fromSelf: true }]);
      setInput("");
    }
  };

  const handleBack = () => {
    router.push("/conversation-history");
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return chatbot ? (
    loading ? (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "position" for more predictable input handling
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
      >
        <View className="bg-white p-5 flex-1">
          <View className="relative flex-row justify-center items-center mt-12 mb-6 mx-2">
            <TouchableOpacity
              className="absolute left-2 h-16 w-16 align-middle justify-center"
              onPress={handleBack}
            >
              <Icon name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-llight text-lg">
              {chatbotId === "0" ? "Lumina GPT-4o" : chatbot.name}
            </Text>
          </View>
          <ScrollView className="flex-1 ">
            <View className="flex-1 translate-y-72 items-center justify-center">
              <Icon name="database" size={24} color="black" />
              <Text className="text-center font-llight text-lg mt-3">
                Loading messages...
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    ) : (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
      >
        <View className="bg-white p-5 flex-1">
          <View className="relative flex-row justify-center items-center mt-12 mb-6 mx-2">
            <TouchableOpacity
              className="absolute left-2 h-16 w-16 align-middle justify-center"
              onPress={handleBack}
            >
              <Icon name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-llight text-lg">
              {chatbotId === "0" ? "Lumina GPT-4o" : chatbot.name}
            </Text>
          </View>

          {/* Messages or No Messages */}
          {messages.length === 0 ? (
            <View className="h-[80%] justify-center align-middle items-center flex-1 ">
              <Image
                source={require("../../assets/images/icon.png")}
                className="w-[100px] h-[100px]"
              />
              <Text className="font-llight text-2xl">Lumina</Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1 }} // Ensures content takes full height
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled" // Ensures the scroll view handles taps when the keyboard is up
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            >
              {messages.map((message, index) => (
                <View
                  key={message._id || index}
                  className={`mb-2 max-w-[80%] ${
                    message.fromSelf
                      ? "self-end bg-gray-100 rounded-3xl p-4"
                      : "self-start flex-row items-center"
                  }`}
                >
                  {!message.fromSelf && (
                    <Image
                      source={require("../../assets/images/icon.png")}
                      className="w-9 h-9 rounded-full mr-2"
                    />
                  )}
                  <Markdown className="font-llight text-base ">
                    {message.content}
                  </Markdown>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Input Box */}
          <View className="h-16 flex-row items-center p-4 bg-gray-100 my-2 mx-2 rounded-full">
            <TextInput
              className="flex-1 px-4 py-4 mr-9 h-16 rounded-full text-base font-llight"
              placeholder="Ask me anything..."
              value={input}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setInput(text)}
            />
            <TouchableOpacity
              className="absolute right-5"
              onPress={handleSend}
              disabled={!input}
            >
              <Icon name="paper-airplane" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  ) : (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "position" for more predictable input handling
      keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
    >
      <View className="bg-white p-5 flex-1">
        <View className="relative flex-row justify-center items-center mt-12 mb-6 mx-2">
          <TouchableOpacity
            className="absolute left-2 h-16 w-16 align-middle justify-center"
            onPress={handleBack}
          >
            <Icon name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 ">
          <View className="flex-1 translate-y-72 items-center justify-center">
            <Icon name="dependabot" size={24} color="black" />
            <Text className="text-center font-llight text-lg mt-3">
              This chatbot may have been disabled. Please try using other
              chatbots, or come back later!
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
