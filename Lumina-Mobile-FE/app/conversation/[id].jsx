import React, { useState, useContext, useCallback } from "react";
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

const ChatScreen = ({ navigation }) => {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]); // Start with zero messages
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(params.id); // Get conversation ID from params
  const [chatTitle, setChatTitle] = useState(params.chatBot);
  const [loading, setLoading] = useState(true);
  const { email } = useUser(); // Get email from context

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

  // Fetch messages on initial render
  React.useEffect(() => {
    console.log("Conversation ID: ", conversationId);
    if (conversationId !== "new") {
      fetchConversation();
    } else {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {}, [messages]);

  // Handle sending a message
  const handleSend = async () => {
    console.log("Sending message: ", input);
    if (input.trim()) {
      if (messages.length === 0) {
        const res = await axios.post("conversation/", {
          userEmail: email,
          chatbot: "Lumina GPT-4o-mini",
          firstMessage: input,
        });
        setConversationId(res.data.conversation._id);
        const currentConversationId = res.data.conversation._id;
        const [messageRes, conversationRes] = await Promise.all([
          // Concurrent requests since they are not dependent on each other
          axios.post("/message", {
            conversationId: currentConversationId,
            fromSelf: true,
            content: input,
          }),
          axios.put("/conversation/" + currentConversationId, {
            lastMessage: input,
          }),
        ]);
        setMessages([...messages, { content: input, fromSelf: true }]);
        setInput("");
      } else {
        console.log("Conversation exists: ", conversationId);
        await axios.post("/message", {
          conversationId: conversationId,
          fromSelf: true,
          content: input,
        });
        console.log("Conversation updated: ", conversationId);
        await axios.put("/conversation/" + conversationId, {
          lastMessage: input,
        });
        setMessages([...messages, { content: input, fromSelf: true }]);
        setInput("");
      }
    }
  };

  const handleBack = () => {
    router.push("/conversation-history");
  };

  return loading ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "position" for more predictable input handling
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
      >
        <View className="h-full bg-white p-5">
          <View className="relative flex-row justify-center items-center mt-12 mb-6 mx-2">
            <TouchableOpacity
              className="absolute left-2 h-16 w-16 align-middle justify-center"
              onPress={handleBack}
            >
              <Icon name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-llight text-lg">{chatTitle}</Text>
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
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "position" for more predictable input handling
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust offset as needed for iOS
      >
        <View className="h-full bg-white p-5">
          <View className="relative flex-row justify-center items-center mt-12 mb-6 mx-2">
            <TouchableOpacity
              className="absolute left-2 h-16 w-16 align-middle justify-center"
              onPress={handleBack}
            >
              <Icon name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-llight text-lg">{chatTitle}</Text>
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
            <ScrollView className="flex-1 ">
              {messages.map((message) => (
                <View
                  key={message._id}
                  className={`mb-2 max-w-[80%] ${
                    message.fromSelf
                      ? "self-end bg-gray-100 rounded-3xl p-4"
                      : "self-start flex-row items-center"
                  }`}
                >
                  {!message.fromSelf && (
                    <Image
                      source={{
                        uri: "https://randomuser.me/api/portraits/men/32.jpg",
                      }} // Example avatar
                      className="w-9 h-9 rounded-full mr-2"
                    />
                  )}
                  <Text className="font-llight text-base ">
                    {message.content}
                  </Text>
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
    </TouchableWithoutFeedback>
  );
};

export default ChatScreen;
