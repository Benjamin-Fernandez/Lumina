import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import { router } from "expo-router";
import CustomCard from "../../components/CustomCard";

const FavouriteChatbots = () => {
  handleBack = () => {
    router.push("/home");
  };
  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View className="relative flex-row justify-center items-center mt-12 mx-2">
        <TouchableOpacity
          className="absolute left-2 h-16 w-16 align-middle justify-center"
          onPress={handleBack}
        >
          <Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-lregular text-xl align-middle">
          Favourite Chatbots
        </Text>
      </View>

      <View className="flex-row justify-between items-center ml-2 mr-3 mt-4">
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"SC2000 Chatbot"} favourite={true} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"HW0028 Chatbot"} favourite={true} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"AskNarelle"} favourite={true} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FavouriteChatbots;
