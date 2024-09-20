import { ScrollView, StatusBar, Text, View, Image, Button } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { Octicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';

// const config = {   
//   issuer: 'https://login.microsoftonline.com/eb5a9f14-35b1-491a-8e43-fd42a0b8a540',   
//   clientId: '8056ae32-9e42-4e77-bb36-2bb47f029744',   
//   redirectUrl: 'exp://10.91.206.64:8081',   
//   scopes: ['openid', 'profile', 'email'],   
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://login.microsoftonline.com/eb5a9f14-35b1-491a-8e43-fd42a0b8a540/oauth2/v2.0/authorize',
//     tokenEndpoint: 'https://login.microsoftonline.com/eb5a9f14-35b1-491a-8e43-fd42a0b8a540/oauth2/v2.0/token',
//   },
// };
async function signIn() {
  const authUrl = 'https://login.microsoftonline.com/eb5a9f14-35b1-491a-8e43-fd42a0b8a540/oauth2/v2.0/authorize?client_id=8056ae32-9e42-4e77-bb36-2bb47f029744&response_type=code&redirect_uri=exp://10.91.206.64:8081&response_mode=query&scope=openid+profile+email';
  // const result = await AuthSession.startAsync({ authUrl });
  // console.log(result);
  try {
    const result = await AuthSession.startAsync({ authUrl });
    if (result.type === 'success') {
      // Store the token securely
      await SecureStore.setItemAsync('authToken', result.params.access_token);
      // Navigate to the main app or home screen
      router.push('/home');
    } else {
      // Handle failure
      console.error('Login failed:', result);
    }
  } catch (error) {
    console.error('Auth Error:', error);
  }
}


export default function App() { 

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center h-[50%] px-4">
          <Image
            source={require('../assets/images/icon.png')}
            className="w-[230px] h-[295px]"
            resizeMode='contain'
          />
        </View>
        <View className="w-full p-12">
          <Text
          className="font-lregular text-custom-header w-[183px] mb-3">
            Welcome to Lumina 👋!
          </Text>
          <Text className="font-llight text-custom-subheader text-subheader">
            Lumina is designed for NTU students only. Please sign in to continue. 
          </Text>
        </View>
        <View className="w-full justify-center items-center px-12">
          <CustomButton
            title="Sign In"
            icon = {Octicons}
            iconProps={{ name: 'sign-in', size: 24, color: '#fff' }}
            // handlePress={() => router.push('/conversation-history')}
            handlePress={signIn}
            containerStyles = "w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}