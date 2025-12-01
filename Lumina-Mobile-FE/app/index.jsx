import {
ScrollView,
StatusBar,
Text,
View,
Image,
Button,
Dimensions,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { Octicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "../config/axiosConfig";
import { Buffer } from "buffer";
import {
exchangeCodeAsync,
makeRedirectUri,
useAuthRequest,
useAutoDiscovery,
} from "expo-auth-session";
import { useUser } from "../context/UserContext";
import { authConfig } from "../config/authConfig";




WebBrowser.maybeCompleteAuthSession();




export default function App() {
// Use configuration from authConfig
const discovery = useAutoDiscovery(authConfig.authority);
const clientId = authConfig.clientId;




// Use MSAL standard redirect URI format
const redirectUri = `msal${clientId}://auth`;




console.log("Redirect URI:", redirectUri);




// Store token
const [token, setToken] = useState(null);




// Request to sign in
const [request, , promptAsync] = useAuthRequest(
  {
    clientId,
    scopes: authConfig.scopes,
    redirectUri,
  },
  discovery
);




const { setEmail } = useUser();
const { width, height } = Dimensions.get("window");




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




// Function to handle sign in
const handleSignIn = async () => {
  promptAsync().then((codeResponse) => {
    if (request && codeResponse?.type === "success" && discovery) {
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
            const userEmail = parseJwt(idToken).email;


            return (
              axios
                .get("user/email/" + userEmail)
                .then((userResponse) => {
                  // If user does not exist, create a new user
                  if (userResponse.data.user === null) {
                    console.log("User not found, creating new user...");
                    return axios.post("user/", {
                      email: userEmail,
                    });
                  } else {
                    console.log("User found in database");
                    return userResponse;
                  }
                })
                .then(() => {
                  // Only redirect if user was successfully created or found
                  console.log("User signed in successfully");
                  setToken(res.accessToken);
                  setEmail(userEmail);
                  router.push("/home");
                })
                .catch((dbError) => {
                  console.error("Database error during sign in:", dbError);
                  // Don't navigate to home if database operations failed
                  alert("Failed to sign in. Please try again.");
                })
            );
          } else {
            console.error("Error: No idToken found in authentication response");
            alert("Authentication failed. Please try again.");
          }
        })
        .catch((authError) => {
          console.error("Authentication error:", authError);
          alert("Authentication failed. Please try again.");
        });
    } else if (codeResponse?.type === "cancel") {
      console.log("User cancelled the sign in");
    } else if (codeResponse?.type === "error") {
      console.error("Authentication error:", codeResponse.error);
      alert("Authentication failed. Please try again.");
    }
  }).catch((promptError) => {
    console.error("Error prompting for authentication:", promptError);
    alert("Failed to start authentication. Please try again.");
  });
};




return (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: height * 0.6, // 40% of screen height
          paddingHorizontal: 16,
        }}
      >
        <Image
          source={require("../assets/images/icon.png")}
          style={{
            width: width * 0.5, // 50% of screen width
            height: width * 0.7, // Maintain aspect ratio
            resizeMode: "contain",
          }}
        />
      </View>




      <View
        style={{
          width: "100%",
          height: height * 0.4, // 40% of screen height
          padding: 40,
        }}
      >
        <View>
          <Text
            className="font-llight text-custom-header"
            style={{
              fontSize: 28,
              color: "#333",
              textAlign: "start",
            }}
          >
            Welcome to
          </Text>
          <Text
            className="font-llight text-custom-header"
            style={{
              fontSize: 28,
              color: "#333",
              textAlign: "start",
              marginBottom: 8,
            }}
          >
            Lumina 👋!
          </Text>
          <Text
            className="font-llight text-custom-subheader text-subheader"
            style={{
              fontFamily: "sans-serif-light",
              fontSize: 16,
              color: "#666",
              textAlign: "start",
            }}
          >
            Lumina is designed for NTU students only. Please sign in to
            continue.
          </Text>
        </View>




        <View className="justify-center items-center">
          <CustomButton
            title="Sign In with Microsoft"
            icon={Octicons}
            iconProps={{ name: "key", size: 24, color: "#fff" }}
            handlePress={handleSignIn}
            containerStyles="w-full mt-7"
          />
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}















