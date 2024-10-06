import { ScrollView, StatusBar, Text, View, Image, Button } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { Octicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { Buffer } from "buffer";
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
  axios.defaults.baseURL = "http://192.168.0.103:3000";

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

  // To decode JWT from SSO
  // Function to decode the JWT

  function parseJwt(token) {
    if (!token) {
      console.error("Token is undefined or null");
      return {};
    }

    const base64Url = token.split(".")[1];
    if (!base64Url) {
      console.error("Invalid token structure");
      return {};
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");

    return JSON.parse(jsonPayload);
  }

  // // Assuming you have the idToken from the authentication response
  // const idToken = "your-id-token-here";
  // const decodedToken = parseJwt(idToken);

  // // Accessing the email
  // const email = decodedToken.email || decodedToken.preferred_username;
  // console.log("User's email:", email);

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
                    )
                      .then((res) => {
                        if (res.idToken) {
                          const idToken = res.idToken;
                          return axios
                            .get(
                              "/api/user/email/" + parseJwt(res.idToken).email
                            )
                            .then((res) => {
                              if (res.data.user === null) {
                                return axios.post("/api/user/", {
                                  email: parseJwt(idToken).email,
                                });
                              }
                            })
                            .then(() => {
                              setToken(res.accessToken); // This should be inside the promise chain
                              router.push("/home");
                            });
                        } else {
                          console.log("Error: No idToken found");
                        }
                      })
                      .catch((err) => {
                        console.log(err);
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
