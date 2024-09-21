import React, { useState } from "react";
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
import { router } from "expo-router";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]); // Start with zero messages
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: input, fromSelf: true },
      ]);
      setInput("");
    }
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined} // 'padding' works well for iOS; Android manages it by default
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0} // Adjust this value to reduce the padding
      >
        <View className="h-full bg-white p-5">
          <View className="relative flex-row justify-center items-center mt-12 mx-2">
            <TouchableOpacity className="absolute left-2">
              <Icon
                name="chevron-left"
                size={24}
                color="black"
                onPress={handleBack}
              />
            </TouchableOpacity>
            <Text className="font-lregular text-xl align-middle">
              Chat Title
            </Text>
          </View>

          {/* Messages or No Messages */}
          <ScrollView className="flex-1 p-4">
            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 text-lg">No messages yet</Text>
              </View>
            ) : (
              messages.map((message) => (
                <View
                  key={message.id}
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
                  <Text className="font-llight text-base">{message.text}</Text>
                </View>
              ))
            )}
          </ScrollView>

          {/* Input Box */}
          <View className="flex-row items-center p-4">
            <TextInput
              className="flex-1 bg-gray-100 px-4 py-2 h-16 rounded-full text-base font-llight"
              placeholder="Ask me anything..."
              value={input}
              onChangeText={(text) => setInput(text)}
            />
            <View className="absolute right-9">
              <TouchableOpacity onPress={handleSend}>
                <Icon name="paper-airplane" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ChatScreen;
