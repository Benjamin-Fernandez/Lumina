import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const CustomConversation = ({ firstLine, date, time }) => {
  return (
    <View className="mt-4 rounded-lg w-[100%] h-[70px] flex-col bg-white p-3 justify-around">
      <Text
        className="font-llight text-[17px] font-bold"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {firstLine}
      </Text>
      <Text className="font-llight text-[17px] text-gray-500">
        {date} | {time}
      </Text>
    </View>
  );
};

export default CustomConversation;
