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
import { useFocusEffect } from "@react-navigation/native";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]); // Start with zero messages
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const { email } = useUser(); // Get email from context
  const params = useLocalSearchParams();

  React.useEffect(() => {
    if (params.id) {
      setConversationId(params.id);
    }
  }, [params.id]);

  const handleSend = async () => {
    console.log("Sending message: ", input);
    if (input.trim()) {
      if (messages.length === 0) {
        const { id } = await axios.post("conversation/", {
          userEmail: email,
          chatbot: "Lumina GPT-4o-mini",
        });
        conversationId = id;
        await axios.post("message/", {
          conversationId: conversationId,
          fromSelf: true,
          content: input,
        });
      } else {
        await axios.post("message/", {
          conversationId: conversationId,
          fromSelf: true,
          content: input,
        });
      }
      await axios.put("conversation/" + conversationId, {
        lastMessage: input,
      });
      setMessages([...messages, { content: input, fromSelf: true }]);
      console.log("Message sent: ", input);
      setInput("");
    }
  };

  const fetchMessages = async () => {
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
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (conversationId !== null) {
        fetchMessages();
      }
    }, [conversationId])
  );

  const handleBack = () => {
    router.push("/conversation-history");
  };

  return (
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
            <Text className="font-lregular text-xl align-middle">
              Chat Title
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
            <ScrollView className="flex-1 ">
              {messages.map((message) => (
                <View
                  key={message._id}
                  className={`mb-2 max-w-[80%] ${
                    message.fromSelf
                      ? "self-end bg-gray-100 rounded-full p-3"
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
                  <Text className="font-llight text-base">
                    {message.content}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Input Box */}
          <View className="flex-row items-center p-4 ">
            <TextInput
              className="flex-1 bg-gray-100 px-4 py-2 h-16 rounded-full text-base font-llight"
              placeholder="Ask me anything..."
              value={input}
              onChangeText={(text) => setInput(text)}
            />
            <TouchableOpacity className="absolute right-9" onPress={handleSend}>
              <Icon name="paper-airplane" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ChatScreen;
