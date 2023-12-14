import React from 'react'

import Ionicons from "react-native-vector-icons/Ionicons"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfileScreen from './screens/ProfileScreen'
import ActivitiesScreen from './screens/ActivitiesScreen'
import LoanScreen from './screens/LoanScreen'
import { COLORS } from '../constants'


const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const screenOptions = {
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
      position: "absolute",
      bottom: 12,
      right: 12,
      left: 12,
      elevation: 0,
      height: 70,
      borderRadius: 10,
      // borderWidth: 1,
      // borderColor: COLORS.tungfamGrey,
      // backgroundColor: COLORS.tungfamGrey
    },
  };
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? COLORS.TungfamBgColor : COLORS.gray2}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? COLORS.TungfamBgColor : COLORS.gray2}
              />
            );
          },
        }}
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
