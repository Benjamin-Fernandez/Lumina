import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Octicons"; // Assuming you're using Material Icons
import CustomCard from "../../components/CustomCard";
import { router } from "expo-router";

const Home = ({ username, onLogout }) => {
  handleLogOut = () => {
    router.push("/");
  };
  handleFavouriteChatbot = () => {
    router.push("/chatbots/favourites");
  };
  handleDiscoverChatbot = () => {
    router.push("/chatbots/discover");
  };
  handleChatbotDetail = () => {
    router.push("/chatbots/1");
  };
  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View className="flex-row justify-between items-center mt-16 mx-2">
        {/* <Text className="text-lg font-bold">Hello, {username}</Text> */}
        <Text className="font-llight text-3xl">Home </Text>
        <TouchableOpacity onPress={handleLogOut}>
          <Icon name="sign-out" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Favourite Chatbots Row*/}
      <TouchableOpacity onPress={handleFavouriteChatbot}>
        <View className="flex-row justify-between items-center mt-12 ml-2 mr-3">
          <Text className="font-lregular text-xl">Favourite Chatbots</Text>
          <Icon name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>

      {/* Chatbots */}
      <View className="flex-row justify-between items-center ml-2 mr-3 mt-4">
        <TouchableOpacity className="w-[30%]" onPress={handleChatbotDetail}>
          <CustomCard title={"SC2000 Chatbot"} favourite={true} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"HW0028 Chatbot"} favourite={true} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"AskNarelle"} favourite={true} />
        </TouchableOpacity>
      </View>

      {/* Discover Chatbots Row*/}
      <TouchableOpacity onPress={handleDiscoverChatbot}>
        <View className="flex-row justify-between items-center mt-12 ml-2 mr-3">
          <Text className="font-lregular text-xl">Discover Chatbots</Text>
          <Icon name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>

      {/* Chatbots */}
      <View className="flex-row justify-between items-center ml-2 mr-3 mt-4">
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"SC2000 Chatbot"} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"HW0028 Chatbot"} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"AskNarelle"} />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-center ml-2 mr-3 mt-2">
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"SC2000 Chatbot"} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"HW0028 Chatbot"} />
        </TouchableOpacity>
        <TouchableOpacity className="w-[30%]">
          <CustomCard title={"AskNarelle"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
