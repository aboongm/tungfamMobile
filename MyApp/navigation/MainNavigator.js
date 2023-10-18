import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfileScreen from './screens/ProfileScreen'
import ActivitiesScreen from './screens/ActivitiesScreen'
import LoanScreen from './screens/LoanScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerTitle: "" }}>
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        // options={{
        //   tabBarLabel: "Chats",
        //   tabBarIcon: ({ color, size }) => (
        //     <Ionicons name="chatbubble-outline" size={size} color={color} />
        //   ),
        // }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        // options={{
        //   tabBarLabel: "Settings",
        //   tabBarIcon: ({ color, size }) => (
        //     <Ionicons name="settings-outline" size={size} color={color} />
        //   ),
        // }}
      />
    </Tab.Navigator>
  )
}

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoanScreen"
          component={LoanScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
      </Stack.Group>     
    </Stack.Navigator>
  );
}

export default MainNavigator

const styles = StyleSheet.create({})