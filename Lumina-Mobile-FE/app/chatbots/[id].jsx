import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "../../config/axiosConfig";
import { useChatbot } from "../../context/ChatbotContext";
import { useUser } from "../../context/UserContext";

const ChatbotDetail = () => {
  handleBack = () => {
    router.push("/home");
  };

  const [chatbot, setChatbot] = useState({});
  const [loading, setLoading] = useState(true);
  const { favouriteChatbots, discoverChatbots } = useChatbot();
  const { setFavouriteChatbots, setDiscoverChatbots } = useChatbot();
  const [favourite, setFavourite] = useState(false);
  const { email } = useUser();

  const params = useLocalSearchParams();
  console.log("Params: ", params);

  const fetchDetails = async () => {
    // Fetch chatbot details
    try {
      const response = await axios.get("/chatbot/" + params.id);
      console.log("Chatbot details:", response.data);
      setChatbot(response.data.chatbot);
      // Check if the chatbot is in the user's favourite chatbots
      if (
        favouriteChatbots.some(
          (favChatbot) => favChatbot._id === response.data.chatbot._id
        )
      ) {
        setFavourite(true);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching chatbot details:", error);
    }
  };

  const handleFavourite = async (chatbot) => {
    // Add the chatbot to the user's favourite chatbots
    try {
      let updatedFavouriteChatbots = [];
      let updatedDiscoverChatbots = [];
      if (
        favouriteChatbots.some((favChatbot) => favChatbot._id === chatbot._id)
      ) {
        console.log("Removing chatbot from favourites");
        // Remove the chatbot from the user's favourite chatbots
        updatedFavouriteChatbots = favouriteChatbots.filter(
          (favChatbot) => favChatbot._id !== chatbot._id
        );
        updatedDiscoverChatbots = [...discoverChatbots, chatbot];
        setFavourite(false);
      } else {
        console.log("Adding chatbot to favourites");
        // Add the new chatbotID to the existing favourite_chatbot array
        updatedFavouriteChatbots = [...favouriteChatbots, chatbot];
        console.log("Updated Favourite Chatbots: ", updatedFavouriteChatbots);
        // Remove the chatbot from the discover chatbots
        updatedDiscoverChatbots = discoverChatbots.filter(
          (discoverChatbot) => discoverChatbot._id !== chatbot._id
        );
        setFavourite(true);
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
  const handleNewChat = () => {
    router.push({
      pathname: "/conversation/new",
      params: {
        chatbotId: chatbot._id,
      },
    });
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return loading ? (
    <View className="h-full bg-white p-5">
      <View className="flex-row justify-between items-center mt-12 mx-2">
        <TouchableOpacity
          className="absolute left-2 h-16 w-16 align-middle justify-center"
          onPress={handleBack}
        >
          <Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-col mt-4">
        <View className="flex-1 translate-y-80 items-center justify-center">
          <Icon name="database" size={24} color="black" />
          <Text className="text-center font-llight text-lg mt-3">
            Loading chatbot...
          </Text>
        </View>
      </ScrollView>
    </View>
  ) : (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View className="flex-row justify-between items-center mt-12 mx-2">
        <TouchableOpacity
          className="absolute left-2 h-16 w-16 align-middle justify-center"
          onPress={handleBack}
        >
          <Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-row w-full p-7 justify-start">
        <View className="">
          <Image
            className="w-[100px] h-[100px] rounded-full"
            source={{ uri: chatbot.image }}
          />
        </View>
        <View className="flex-col ml-6">
          <Text className="font-lregular text-2xl mb-1">
            {/* {chatbot.chatbot.name} */}
            {chatbot.name}
          </Text>
          <Text className="font-lregular text-base">
            {/* Last Updated: {chatbot.chatbot.updatedAt.split("T")[0]} */}
            Version: {chatbot.version}
          </Text>
          <Text className="font-lregular text-base">
            {/* Last Updated: {chatbot.chatbot.updatedAt.split("T")[0]} */}
            Last Updated: {chatbot.updatedAt.split("T")[0]}
          </Text>
          {/* <Text className="font-lregular text-base">Ratings:</Text> */}
        </View>
        <View className="absolute bottom-5 right-10">
          <TouchableOpacity onPress={() => handleFavourite(chatbot)}>
            {favourite ? (
              <Icon name="heart-fill" size={24} color="red" />
            ) : (
              <Icon name="heart" size={24} color="red" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-7">
        <Text className="font-lregular text-lg mb-5">Category</Text>
        <Text className="font-llight text-[17px] mb-5">
          {/* {chatbot.chatbot.description} */}
          {chatbot.category}
        </Text>
      </View>
      <View className="px-7">
        <Text className="font-lregular text-lg mb-5">Description</Text>
        <Text className="font-llight text-[17px] mb-5">
          {/* {chatbot.chatbot.description} */}
          {chatbot.description}
        </Text>
      </View>
      <TouchableOpacity className="px-7" onPress={handleNewChat}>
        <View className="w-full h-[50px] rounded-full bg-primaryButton mt-8 items-center justify-center">
          <Text className="font-lregular text-lg text-white">
            Start Chatbot
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatbotDetail;
