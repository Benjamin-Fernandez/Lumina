import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import { router } from "expo-router";
import CustomCard from "../../components/CustomCard";
import { useChatbot } from "../../context/ChatbotContext";
import { useUser } from "../../context/UserContext";
import axios from "../../config/axiosConfig";

const FavouriteChatbots = () => {
  const handleBack = () => {
    router.push("/home");
  };
  const handleFavourite = async (chatbot) => {
    // Add the chatbot to the user's favourite chatbots
    try {
      let updatedFavouriteChatbots = [];
      let updatedDiscoverChatbots = [];
      if (favouriteChatbots.includes(chatbot)) {
        console.log("Removing chatbot from favourites");
        // Remove the chatbot from the user's favourite chatbots
        updatedFavouriteChatbots = favouriteChatbots.filter(
          (favChatbot) => favChatbot._id !== chatbot._id
        );
        updatedDiscoverChatbots = [...discoverChatbots, chatbot];
      } else {
        console.log("Adding chatbot to favourites");
        // Add the new chatbotID to the existing favourite_chatbot array
        updatedFavouriteChatbots = [...favouriteChatbots, chatbot];
        console.log("Updated Favourite Chatbots: ", updatedFavouriteChatbots);
        // Remove the chatbot from the discover chatbots
        updatedDiscoverChatbots = discoverChatbots.filter(
          (discoverChatbot) => discoverChatbot._id !== chatbot._id
        );
      }
      // Update the user's favourite chatbots in the database
      const response = await axios.put("/user/email/" + email, {
        favourite_chatbot: updatedFavouriteChatbots,
      });
      setFavouriteChatbots(updatedFavouriteChatbots);
      setDiscoverChatbots(updatedDiscoverChatbots);
    } catch (error) {
      console.error("Error updating favourite chatbots:", error);
    }
  };

  {
    /* Context */
  }
  const {
    favouriteChatbots,
    discoverChatbots,
    setDiscoverChatbots,
    setFavouriteChatbots,
  } = useChatbot();

  const { email } = useUser();

  const handleChatbotDetail = (chatbot) => {
    router.push("/chatbots/" + chatbot._id);
  };
  const { height } = Dimensions.get("window");

  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View
        className="relative flex-row justify-center items-center mx-2"
        style={{ height: height * 0.1 }}
      >
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
      <ScrollView className="flex-col" contentContainerStyle={{ flexGrow: 1 }}>
        {favouriteChatbots.length === 0 ? (
          <View className="flex-row justify-center items-center ml-2 mr-3 h-[80%] border-gray-300 p-4 rounded-lg ">
            <Icon name="info" size={24} color="gray" />
            <Text className="font-lregular text-lg ml-2">
              No Favourite Chatbots
            </Text>
          </View>
        ) : (
          <View className="flex-column items-center ml-2 mr-3">
            {favouriteChatbots
              .reverse()
              .reduce((rows, chatbot, index) => {
                if (index % 3 === 0) rows.push([]);
                rows[rows.length - 1].push(chatbot);
                return rows;
              }, [])
              .map((row, rowIndex) => (
                <View
                  className="flex-row items-center ml-2 mr-3 w-full"
                  key={rowIndex}
                >
                  {row.map((chatbot, index) => (
                    <TouchableOpacity
                      className="w-[30%] mr-5"
                      key={index}
                      onPress={() => handleChatbotDetail(chatbot)}
                    >
                      <CustomCard
                        title={chatbot.name}
                        chatbot={chatbot}
                        favourite={true}
                        handleFavourite={handleFavourite}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FavouriteChatbots;
