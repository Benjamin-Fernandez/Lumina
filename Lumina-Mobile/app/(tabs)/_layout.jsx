import { View, Text } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import CustomNavigationBar from "../../components/CustomNavigationBar";

const TabsLayout = () => {
  return (
    <>
      <Tabs tabBar={(props) => <CustomNavigationBar {...props} />}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: "dependabot",
          }}
        />
        <Tabs.Screen
          name="new-conversation"
          options={{
            title: "Start",
            headerShown: false,
            tabBarIcon: "plus-circle",
          }}
        />
        <Tabs.Screen
          name="conversation-history"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: "inbox",
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
