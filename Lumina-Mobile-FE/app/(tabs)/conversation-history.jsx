import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import CustomConversation from "../../components/CustomConversation";
import { router } from "expo-router";
import axios from "../../config/axiosConfig";
import { useUser } from "../../context/UserContext";

const ConversationHistory = () => {
  const [conversations, setConversations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { email } = useUser();

  const handleNewChat = () => {
    router.push({
      pathname: "/conversation/new/",
      params: { chatBot: "Lumina GPT-4o-mini" },
    });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get("/conversation/email/" + email);
      console.log("Conversations fetched from the database: ", response.data);
      const { conversations } = response.data;
      const sortedConversations = conversations.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      setConversations(sortedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    console.log("User email obtained from context " + email);
    // Fetch conversations from the database
    fetchConversations();
  }, []);

  return loading ? (
    <View className="h-full bg-white p-5">
      <View className="h-[85%]">
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
          <View className="flex-1 translate-y-64 items-center justify-center">
            <Icon name="database" size={24} color="black" />
            <Text className="text-center font-llight text-lg mt-3">
              Loading conversations...
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  ) : (
    <View className="h-full bg-white p-5">
      <View className="h-[85%]">
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
          {conversations.length === 0 ? (
            <View className="flex-1 translate-y-64 items-center justify-center">
              <Icon name="archive" size={24} color="black" />
              <Text className="text-center font-llight text-lg mt-3">
                No conversations found.
              </Text>
            </View>
          ) : (
            conversations.map((conversation, index) => {
              return (
                <React.Fragment key={index}>
                  <CustomConversation
                    id={conversation._id}
                    chatBot={conversation.chatbot}
                    lastMessage={conversation.lastMessage}
                    date={conversation.updatedAt.split("T")[0]}
                    time={conversation.updatedAt.split("T")[1].split(".")[0]}
                  />
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#ccc",
                      marginVertical: 10,
                    }}
                  />
                </React.Fragment>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ConversationHistory;
