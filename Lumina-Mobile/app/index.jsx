import { ScrollView, StatusBar, Text, View, Image, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { Octicons } from '@expo/vector-icons';
import { authorize } from 'react-native-app-auth';  

const config = {
  issuer: 'https://login.microsoftonline.com/common',
  clientId: '8056ae32-9e42-4e77-bb36-2bb47f029744', // Replace with your microsoft client id
  redirectUrl: 'com.lumina://oauth/auth/', // replace with your redirect uri added in microsoft portal
  scopes: ['openid', 'profile', 'email'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    revocationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout',
  },
  useNonce: true, 
  usePKCE: true, //For iOS, we have added the useNonce and usePKCE parameters, which are recommended for security reasons.
  additionalParameters: {
    prompt: 'consent',
  },
};

const microsoftSignIn = async () => {
    try {
      const { idToken } = await authorize(config);
      console.log(idToken) // here you get the idToken if login successful.
    } catch (error) {
      //on login error 
    }
  };

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
            handlePress={microsoftSignIn}
            containerStyles = "w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}