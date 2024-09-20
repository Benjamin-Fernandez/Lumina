import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Octicons"; // Assuming you're using Material Icons
import CustomCard from "../../components/CustomCard";

const Home = ({ username, onLogout }) => {
  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View className="flex-row justify-between items-center mt-16 mx-2">
        {/* <Text className="text-lg font-bold">Hello, {username}</Text> */}
        <Text className="font-llight text-3xl">Hello, Jane 👋! </Text>
        <TouchableOpacity onPress={onLogout}>
          <Icon name="sign-out" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Favourite Chatbots Row*/}
      <View className="flex-row justify-between items-center mt-12 ml-2 mr-3">
        <Text className="font-llight text-xl">Favourite Chatbots</Text>
        <TouchableOpacity>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Chatbots */}
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

      {/* Discover Chatbots Row*/}
      <View className="flex-row justify-between items-center mt-12 ml-2 mr-3">
        <Text className="font-llight text-xl">Discover Chatbots</Text>
        <TouchableOpacity>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

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
