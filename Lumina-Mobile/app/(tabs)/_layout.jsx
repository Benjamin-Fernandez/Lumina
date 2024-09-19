import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'

const TabsLayout = () => {
  return (
    <>
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: true,
                    // tabBarIcon: 
                }}
            />
            <Tabs.Screen
              name="new-conversation"
              options={{
                title:'Start',
                headerShown: true,
                // tabBarIcon
              }}
            />
            <Tabs.Screen
              name="conversation-history"
              options={{
                title:'History',
                headerShown: true,
                // tabBarIcon
              }}
            />
            
        </Tabs>
    </>
  )
}

export default TabsLayout