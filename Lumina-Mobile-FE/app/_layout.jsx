import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { UserProvider } from "../context/UserContext";
import { ChatbotProvider } from "../context/ChatbotContext";

SplashScreen.preventAutoHideAsync(); // prevent splash screen from auto hiding before asset loading is complete.

const RootLayout = () => {
  // Import fonts
  const [fontsLoaded, error] = useFonts({
    "Lexend-Black": require("../assets/fonts/Lexend-Black.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend-Bold.ttf"),
    "Lexend-ExtraBold": require("../assets/fonts/Lexend-ExtraBold.ttf"),
    "Lexend-ExtraLight": require("../assets/fonts/Lexend-ExtraLight.ttf"),
    "Lexend-Light": require("../assets/fonts/Lexend-Light.ttf"),
    "Lexend-Medium": require("../assets/fonts/Lexend-Medium.ttf"),
    "Lexend-Regular": require("../assets/fonts/Lexend-Regular.ttf"),
    "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Thin": require("../assets/fonts/Lexend-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // hides the native splash screen immediately
    }
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      {/* Slot returns the current child.  */}
      <UserProvider>
        <ChatbotProvider>
          <Slot />
        </ChatbotProvider>
      </UserProvider>
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: "1",
    alignItems: "center",
    justifyContent: "center",
  },
});
