import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons"; // You can use other icon sets
import tailwindConfig from "../tailwind.config.js";
import { router } from "expo-router";

const colors = tailwindConfig.theme.extend.colors;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View className="flex-row bg-white rounded-full h-[70px] mx-5 absolute bottom-5 left-0 right-0 shadow-lg justify-around items-center px-5">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            router.push({
              pathname: `/${route.name}`,
              params: {
                previousRoute: router.pathname,
              },
            });
          }
        };

        const iconName = options.tabBarIcon || "home"; // Default to 'home' icon

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            className={`flex-1 justify-center items-center`}
          >
            <Icon
              name={iconName}
              size={24}
              color={
                isFocused ? colors.primaryButton : colors.unfocusedNavigation
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
