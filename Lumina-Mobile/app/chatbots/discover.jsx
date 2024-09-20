import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import { router } from "expo-router";
import CustomCard from "../../components/CustomCard";

const DiscoverChatbot = () => {
  handleBack = () => {
    router.back();
  };
  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
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
          Discover Chatbots
        </Text>
      </View>

      <View className="flex-row justify-between items-center ml-2 mr-3 mt-4">
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"SC2000 Chatbot"} favourite={false} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"HW0028 Chatbot"} favourite={false} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"AskNarelle"} favourite={false} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DiscoverChatbot;
