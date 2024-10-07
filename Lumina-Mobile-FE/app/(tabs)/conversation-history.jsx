import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import CustomConversation from "../../components/CustomConversation";
import { router } from "expo-router";
import axios from "../../config/axiosConfig";
import { useUser } from "../../context/UserContext";

const ConversationHistory = () => {
  const handleNewChat = () => {
    router.push("/conversations/1");
  };
  const [conversations, setConversations] = React.useState([]);
  const { email } = useUser();

  React.useEffect(() => {
    // Fetch conversations from the database
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/email/" + email);
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

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
        {conversations.length === 0 ? (
          <Text className="text-center">No conversations found.</Text>
        ) : (
          conversations.map((conversation, index) => {
            return (
              <React.Fragment key={index}>
                <CustomConversation
                  firstLine={conversation.firstLine}
                  date={conversation.date}
                  time={conversation.time}
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

        {/* {conversations.map((conversation, index) => (
          conversation.length === 0 && {
            return (
              <Text className="text-center">No conversations found.</Text>
            );
          } else {
            return (
              <React.Fragment key={index}>
                <CustomConversation
                  firstLine={conversation.firstLine}
                  date={conversation.date}
                  time={conversation.time}
                />
                <View
                  style={{ height: 1, backgroundColor: "#ccc", marginVertical: 10 }}
                />
              </React.Fragment>
            );
          }
        ))} */}
      </ScrollView>
    </View>
  );
};

export default ConversationHistory;
