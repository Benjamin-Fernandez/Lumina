import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Octicons"; // Assuming you're using Material Icons
import CustomCard from "../../components/CustomCard";
import { router } from "expo-router";
import axios from "../../config/axiosConfig";
import { useUser } from "../../context/UserContext";
import { useChatbot } from "../../context/ChatbotContext";

const Home = ({ username, onLogout }) => {
  // Onclick Handlers
  const handleLogOut = () => {
    router.push("/");
  };
  const handleFavouriteChatbot = () => {
    router.push("/chatbots/favourites");
  };
  const handleDiscoverChatbot = () => {
    router.push("/chatbots/discover");
  };
  const handleChatbotDetail = (chatbot) => {
    router.push("/chatbots/" + chatbot._id);
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

  // Context
  const { email } = useUser();
  const { favouriteChatbots, discoverChatbots } = useChatbot();
  const { setFavouriteChatbots, setDiscoverChatbots } = useChatbot();
  const { width, height } = Dimensions.get("window");

  // Database Queries
  const fetchChatbots = async () => {
    try {
      const response = await axios.get("/chatbot");
      // console.log("Chatbots fetched from the database: ", response.data);
      const { chatbots } = response.data;

      // Assuming you have a way to get the user's favourite chatbots
      const userResponse = await axios.get("/user/email/" + email);

      // extract the favourite_chatbot from the user's response and store it in a variable userFavouriteChatbots
      const { favourite_chatbot } = userResponse.data.user;

      const favouriteChatbots = [];
      const discoverChatbots = [];

      chatbots.forEach((chatbot) => {
        if (
          favourite_chatbot.find((favChatbot) => favChatbot._id === chatbot._id)
        ) {
          favouriteChatbots.push(chatbot);
        } else {
          discoverChatbots.push(chatbot);
        }
      });
      // console.log("Favourite Chatbots: ", favouriteChatbots);
      // console.log("Discover Chatbots: ", discoverChatbots);
      setFavouriteChatbots(favouriteChatbots);
      setDiscoverChatbots(discoverChatbots);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
    }
  };

  // Lifecycle Methods
  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleRefresh = () => {
    fetchChatbots();
  };

  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View
        className="flex-row justify-between items-center mx-2"
        style={{ marginTop: height * 0.05 }}
      >
        <Text className="font-llight text-3xl">Home </Text>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="sync" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogOut}>
            <Icon name="sign-out" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Favourite Chatbots Row */}
      <TouchableOpacity onPress={handleFavouriteChatbot}>
        <View
          className="flex-row justify-between items-center ml-2 mr-3"
          style={{ marginTop: height * 0.025 }}
        >
          <Text className="font-lregular text-xl">Favourite Chatbots</Text>
          <Icon name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>
      {/* Chatbots */}
      {favouriteChatbots.length === 0 ? (
        <View className="flex-row justify-center items-center ml-2 mr-3 mt-4 border-dotted border-2 h-[15%] border-gray-300 p-4 rounded-lg">
          <Icon name="info" size={24} color="gray" />
          <Text className="font-lregular text-lg ml-2">
            No Favourite Chatbots
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center ml-2 mr-3">
          {favouriteChatbots
            .slice(-3)
            .reverse()
            .map((chatbot, index) => (
              <TouchableOpacity
                className="mr-5"
                style={{ height: height * 0.15, width: (width - 80) / 3 }}
                key={index}
                onPress={() => handleChatbotDetail(chatbot)}
              >
                <CustomCard
                  title={chatbot.name}
                  favourite={true}
                  handleFavourite={handleFavourite}
                  chatbot={chatbot}
                />
              </TouchableOpacity>
            ))}
        </View>
      )}
      {/* Discover Chatbots Row */}
      <TouchableOpacity
        onPress={handleDiscoverChatbot}
        style={{ marginTop: height * 0.075 }}
      >
        <View className="flex-row justify-between items-center ml-2 mr-3">
          <Text className="font-lregular text-xl">Discover Chatbots</Text>
          <Icon name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>
      {/* Chatbots */}
      {discoverChatbots.length === 0 ? (
        <View className="flex-row justify-center items-center ml-2 mr-3 mt-4 border-dotted border-2 h-[140px] border-gray-300 p-4 rounded-lg">
          <Icon name="info" size={24} color="gray" />
          <Text className="font-lregular text-lg ml-2">
            No Chatbots to Discover
          </Text>
        </View>
      ) : (
        discoverChatbots
          .slice(-6)
          .reverse()
          .reduce((rows, chatbot, index) => {
            if (index % 3 === 0) rows.push([]);
            rows[rows.length - 1].push(chatbot);
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <View className="flex-row items-center ml-2 mr-3" key={rowIndex}>
              {row.map((chatbot, index) => (
                <TouchableOpacity
                  className="mr-5"
                  style={{ height: height * 0.2, width: (width - 80) / 3 }}
                  key={index}
                  onPress={() => handleChatbotDetail(chatbot)}
                >
                  <CustomCard
                    title={chatbot.name}
                    chatbot={chatbot}
                    handleFavourite={handleFavourite}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))
      )}
    </View>
  );
};

export default Home;
// marginTop: height * 0.05,
// width: (width - 80) / 3, // Dynamic width for 3 cards per row
