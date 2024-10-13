import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Octicons"; // Assuming you're using Material Icons
import CustomCard from "../../components/CustomCard";
import { router } from "expo-router";
import axios from "../../config/axiosConfig";
import { useUser } from "../../context/UserContext";

const Home = ({ username, onLogout }) => {
  // Onclick Handlers
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

  // Context
  const { email } = useUser();

  // States
  const [discoverChatbots, setDiscoverChatbots] = useState([]);
  const [favouriteChatbots, setFavouriteChatbots] = useState([]);

  // Database Queries
  const fetchChatbots = async () => {
    try {
      const response = await axios.get("/chatbot");
      console.log("Chatbots fetched from the database: ", response.data);
      const { chatbots } = response.data;

      // Assuming you have a way to get the user's favourite chatbots
      const userResponse = await axios.get("/user/email/" + email);
      console.log(
        "User's favourite chatbots fetched from the database: ",
        userResponse.data
      );

      // extract the favourite_chatbot from the user's response and store it in a variable userFavouriteChatbots
      const { favourite_chatbot } = userResponse.data.user;

      const favouriteChatbots = [];
      const discoverChatbots = [];

      chatbots.forEach((chatbot) => {
        if (favourite_chatbot.includes(chatbot._id)) {
          favouriteChatbots.push(chatbot);
        } else {
          discoverChatbots.push(chatbot);
        }
      });
      console.log("Favourite Chatbots: ", favouriteChatbots);
      console.log("Discover Chatbots: ", discoverChatbots);
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

  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View className="flex-row justify-between items-center mt-16 mx-2">
        <Text className="font-llight text-3xl">Home </Text>
        <View className="flex-row">
          <TouchableOpacity onPress={handleLogOut}>
            <Icon name="sign-out" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Favourite Chatbots Row */}
      <TouchableOpacity onPress={handleFavouriteChatbot}>
        <View className="flex-row justify-between items-center mt-10 ml-2 mr-3">
          <Text className="font-lregular text-xl">Favourite Chatbots</Text>
          <Icon name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>
      {/* Chatbots */}
      {favouriteChatbots.length === 0 ? (
        <View className="flex-row justify-between items-center ml-2 mr-3 mt-4">
          <Text className="font-lregular text-lg">No favourite chatbots</Text>
        </View>
      ) : (
        favouriteChatbots
          .slice(-3)
          .reverse()
          .map((chatbot, index) => (
            <View
              className="flex-row justify-between items-center ml-2 mr-3 mt-4"
              key={index}
            >
              <TouchableOpacity className="w-[30%]">
                <CustomCard title={chatbot.name} favourite={true} />
              </TouchableOpacity>
            </View>
          ))
      )}
      {/* Discover Chatbots Row */}
      <TouchableOpacity onPress={handleDiscoverChatbot}>
        <View className="flex-row justify-between items-center mt-12 ml-2 mr-3">
          <Text className="font-lregular text-xl">Discover Chatbots</Text>
          <Icon name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>
      {/* Chatbots */}
      {discoverChatbots.length === 0 ? (
        <View className="flex-row justify-between items-center ml-2 mr-3 mt-4">
          <Text className="font-lregular text-lg">No chatbots found</Text>
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
            <View
              className="flex-row justify-between items-center ml-2 mr-3 mt-4"
              key={rowIndex}
            >
              {row.map((chatbot, index) => (
                <TouchableOpacity className="w-[30%]" key={index}>
                  <CustomCard title={chatbot.name} />
                </TouchableOpacity>
              ))}
            </View>
          ))
      )}
    </View>
  );
};

export default Home;
