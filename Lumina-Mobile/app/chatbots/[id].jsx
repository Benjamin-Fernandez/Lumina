import { View, Text, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import React from "react";
import { router } from "expo-router";

const ChatbotDetail = () => {
  handleBack = () => {
    router.back();
  };
  return (
    <View className="h-full bg-white p-5">
      {/* Greeting + Sign-out Row */}
      <View className="flex-row justify-between items-center mt-12 mx-2">
        <TouchableOpacity>
          <Icon
            name="chevron-left"
            size={24}
            color="black"
            onPress={handleBack}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row w-full p-7 justify-start">
        <View className="">
          <Image
            className="w-[100px] h-[100px] rounded-full bg-black"
            // source={require("../../assets/images/icon.png")}
          />
        </View>
        <View className="flex-col ml-6">
          <Text className="font-lregular text-2xl mb-1">Chatbot Name</Text>
          <Text className="font-lregular text-base">Last Updated:</Text>
          <Text className="font-lregular text-base">Ratings:</Text>
        </View>
        <View className="absolute bottom-8 right-10">
          <TouchableOpacity>
            <Icon name="heart" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-7">
        <Text className="font-lregular text-lg mb-5">Description</Text>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
          mollitia fuga saepe fugiat animi perspiciatis autem atque soluta
          eveniet corporis incidunt veniam nisi maxime dignissimos adipisci
          quisquam asperiores velit corrupti veritatis minima rem dolores aut
          eos. Qui eveniet nihil, eius, quas provident nesciunt sequi possimus,
          tempora soluta fugiat libero facilis sint cumque enim accusantium
          tempore sunt eum neque voluptas iusto? Doloribus nesciunt, unde
          quibusdam quaerat ducimus rem laboriosam blanditiis soluta inventore,
          officiis, minima sit facilis illo provident dolore aliquam debitis
          eligendi. Accusantium veniam labore numquam ex saepe. Eius soluta
          incidunt ex itaque consequatur ullam saepe provident doloremque, iste
          nisi impedit.
        </Text>
      </View>
      <TouchableOpacity className="px-7">
        <View className="w-full h-[40px] rounded-full bg-primaryButton mt-8 items-center justify-center">
          <Text className="font-lregular text-base text-white">
            Start Chatbot
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatbotDetail;
