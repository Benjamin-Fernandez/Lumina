import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import CustomConversation from "../../components/CustomConversation";

const ConversationHistory = () => {
  return (
    <View className="h-full bg-white p-5">
      <View className="flex-row justify-between items-center mt-16 mx-2">
        {/* <Text className="text-lg font-bold">Hello, {username}</Text> */}
        <Text className="font-llight text-3xl">History</Text>
        <TouchableOpacity onPress={handleLogOut}>
          <Icon name="sign-out" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-col">
        <TouchableOpacity>
          <CustomConversation
            firstLine={
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat dolores ratione eligendi velit quo culpa accusantium dolore iure aspernatur atque?"
            }
            date={"21-9-2024"}
            time={"2:00am"}
          />
        </TouchableOpacity>
        <View
          style={{ height: 1, backgroundColor: "#ccc", marginVertical: 10 }}
        />
      </View>
    </View>
  );
};

export default ConversationHistory;
