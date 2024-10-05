import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import CustomConversation from "../../components/CustomConversation";
import { router } from "expo-router";

const ConversationHistory = () => {
  const handleNewChat = () => {
    router.push("/conversations/1");
  };
  return (
    <View className="h-full bg-white p-5">
      <View className="flex-row justify-between items-center mt-16 mx-2">
        <Text className="font-llight text-3xl">History </Text>
        <View className="flex-row">
          <TouchableOpacity onPress={handleNewChat} className="mr-5">
            <Icon name="plus-circle" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogOut}>
            <Icon name="sign-out" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="flex-col mt-4">
        <CustomConversation
          firstLine={
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat dolores ratione eligendi velit quo culpa accusantium dolore iure aspernatur atque?"
          }
          date={"21-9-2024"}
          time={"2:00am"}
        />
        <View
          style={{ height: 1, backgroundColor: "#ccc", marginVertical: 10 }}
        />
      </ScrollView>
    </View>
  );
};

export default ConversationHistory;
