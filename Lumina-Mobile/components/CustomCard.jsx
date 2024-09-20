import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";

const CustomCard = ({ title, description, image }) => {
  return (
    <View className="bg-white mt-4 rounded-lg shadow-lg w-[30%] h-[140px] flex-col">
      {/* Image Section (70% of the card height) */}
      <View className="h-[50%]">
        <Image
          source={{ uri: image }}
          className="w-full h-full rounded-t-lg"
          resizeMode="cover"
        />
      </View>

      {/* Text Section (30% of the card height) */}
      <View className="h-[50%] p-3 flex-row justify-between">
        <View className="flex-[0.70]">
          <Text
            className="font-lregular text-base font-bold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
        <View className="flex-[0.25] mt-4">
          <TouchableOpacity>
            <Icon name="heart" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomCard;
