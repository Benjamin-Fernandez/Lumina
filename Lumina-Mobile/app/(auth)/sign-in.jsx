import { View, Text, ScrollView, Image } from 'react-native'
import CustomButton from '../../components/CustomButton'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Octicons } from '@expo/vector-icons';
import FormField from '../../components/FormField';


const SignIn = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center h-[40%] px-4">
          <Image
            source={require('../../assets/images/icon.png')}
            className="w-[230px] h-[295px]"
            resizeMode='contain'
          />
        </View>
        <View className="w-full p-12">
          <Text
          className="font-lregular text-custom-header w-[183px] mb-3">
            Sign in to continue 🔑!
          </Text>
        </View>
        <View className="w-full justify-center items-center px-12">
          <FormField
          title="username"/>
          <CustomButton
            title="Sign in"
            icon = {Octicons}
            iconProps={{ name: 'sign-in', size: 24, color: '#fff' }}
            handlePress={() => router.push('/conversation-history')}
            containerStyles = "w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn