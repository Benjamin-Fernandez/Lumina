import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";

// Generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CustomCard = ({ title, favourite, image, chatbot, handleFavourite }) => {
  const cardColor = image ? null : getRandomColor(); // Generate a random color if no image

  return (
    <View
      className="mt-4 rounded-lg shadow-lg w-[100%] h-[140px] flex-col"
      style={{ backgroundColor: cardColor }}
    >
      {/* Image Section (50% of the card height) */}
      {chatbot.image ? (
        <View className="h-[50%]">
          <Image
            source={{ uri: chatbot.image }}
            className="w-full h-full rounded-t-lg"
            resizeMode="cover"
          />
        </View>
      ) : (
        <View className="h-[50%] bg-transparent rounded-t-lg" /> // Placeholder for no image
      )}

      {/* Text Section (30% of the card height) */}
      <View className="h-[50%] py-3 px-2 flex-row justify-between bg-white rounded-b-lg">
        <View className="flex-[0.70]">
          <Text
            className="font-llight text-base font-bold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
        <View className="flex-[0.25] mt-6">
          <TouchableOpacity onPress={() => handleFavourite(chatbot)}>
            {favourite ? (
              <Icon name="heart-fill" size={20} color="red" />
            ) : (
              <Icon name="heart" size={20} color="red" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomCard;
