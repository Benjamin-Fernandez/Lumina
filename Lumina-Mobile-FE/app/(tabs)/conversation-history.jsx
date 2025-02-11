import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
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
  const { width, height } = Dimensions.get("window");

  const handleLogOut = () => {
    router.push("/");
  };

  const handleNewChat = () => {
    console.log(router.pathname);
    router.push({
      pathname: "/conversation/new",
      params: { chatbotId: "0", previousRoute: router.pathname },
    });
  };

  const fetchConversations = async () => {
    try {
      console.log("Loading status: ", loading);
      const response = await axios.get("/conversation/email/" + email);
      const { conversations } = response.data;
      const sortedConversations = conversations.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      setConversations(sortedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      console.log("Loading conversations complete.");
      setLoading(false);
    }
  };
  React.useEffect(() => {
    // Fetch conversations from the database
    fetchConversations();
  }, []);

  return loading ? (
    <View className="h-full bg-white p-5">
      <View>
        <View
          className="flex-row justify-between items-center mx-2"
          style={{ marginTop: height * 0.05 }}
        >
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
        <View className="translate-y-64 items-center justify-center">
          <Icon name="archive" size={24} color="black" />
          <Text className="text-center font-llight text-lg mt-3">
            Loading conversations...
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <View className="h-full bg-white p-5">
      <View>
        <View
          className="flex-row justify-between items-center mx-2"
          style={{ marginTop: height * 0.05 }}
        >
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
        <ScrollView className="flex-col mt-4" style={{ height: height * 0.7 }}>
          {conversations.length === 0 ? (
            <View className="flex-1 translate-y-64 items-center justify-center">
              <Icon name="archive" size={24} color="black" />
              <Text className="text-center font-llight text-lg mt-3">
                No conversations found.
              </Text>
            </View>
          ) : (
            conversations.map((conversation, index) => {
              const singaporeTime = new Date(
                conversation.updatedAt
              ).toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
              });
              const [date, time] = singaporeTime.split(", ");
              return (
                <React.Fragment key={index}>
                  <CustomConversation
                    id={conversation._id}
                    chatbotId={conversation.chatbotId}
                    lastMessage={conversation.lastMessage}
                    date={date}
                    time={time}
                    setConversations={setConversations}
                    chatbotName={conversation.chatbotName}
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
