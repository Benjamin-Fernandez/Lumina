import { ScrollView, StatusBar, Text, View, Image, Button } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { Octicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/eb5a9f14-35b1-491a-8e43-fd42a0b8a540/v2.0"
  );
  const redirectUri = "lumina-mobile://auth";
  const clientId = "8056ae32-9e42-4e77-bb36-2bb47f029744";

  // We store the JWT in here
  const [token, setToken] = useState(null);

  // Request
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["openid", "profile", "email", "User.Read"],
      redirectUri,
    },
    discovery
  );

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-[60%] px-4">
          <Image
            source={require("../assets/images/icon.png")}
            className="w-[200px] h-[295px]"
            resizeMode="contain"
          />
        </View>
        <View className="w-full h-[40%] p-12">
          <View>
            <Text className="font-llight text-custom-header w-full">
              Welcome to
            </Text>
            <Text className="font-llight text-custom-header w-full mb-3">
              Lumina 👋!
            </Text>
            <Text className="font-llight text-custom-subheader text-subheader">
              Lumina is designed for NTU students only. Please sign in to
              continue.
            </Text>
          </View>
          <View className="justify-center items-center">
            <CustomButton
              title="Sign In"
              icon={Octicons}
              iconProps={{ name: "sign-in", size: 24, color: "#fff" }}
              handlePress={() => {
                promptAsync().then((codeResponse) => {
                  if (
                    request &&
                    codeResponse?.type === "success" &&
                    discovery
                  ) {
                    exchangeCodeAsync(
                      {
                        clientId,
                        code: codeResponse.params.code,
                        extraParams: request.codeVerifier
                          ? { code_verifier: request.codeVerifier }
                          : undefined,
                        redirectUri,
                      },
                      discovery
                    ).then((res) => {
                      setToken(res.accessToken);
                      router.push("/home");
                    });
                  }
                });
              }}
              // handlePress={signIn}
              containerStyles="w-full mt-7"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
