import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

// Auth Screens do not have nav bar, so it should have a different layout! 

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='sign-in'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='sign-up'
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout