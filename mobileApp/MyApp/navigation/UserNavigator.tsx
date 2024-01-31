import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import ProfileScreen from '../screens/ProfileScreen';
import LoanBookScreen from '../screens/homescreen/LoanBookScreen';
import PaymentScheduleScreen from '../screens/PaymentScheduleScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import AddLoanTypeScreen from "../screens/AddLoanTypeScreen"
import HeaderUser from '../components/HeaderUser';
import LoanApplicationScreen from '../screens/LoanApplicationScreen';
import CreateFirmScreen from '../screens/CreateFirmScreen';

const MaterialTopTabs = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen 
      name="PaymentScheduleScreen" 
      component={PaymentScheduleScreen}
      // options={{ tabBarVisible: false }}
    />
    <Stack.Screen 
      name="InvestmentsScreen" 
      component={InvestmentsScreen}
      // options={{ tabBarVisible: false }}
    />
    <Stack.Screen 
      name="AddLoanTypeScreen" 
      component={AddLoanTypeScreen}
      // options={{ tabBarVisible: false }}
    />
  </Stack.Navigator>
);

type Category = {
  category_id: number;
  category_name: string;
};

// Function to generate RootStackParamList based on fetched categories
const generateRootStackParamList = (categories: Category[]): Record<string, undefined> => {
  const paramList: Record<string, undefined> = {};
  categories.forEach((category) => {
    paramList[category.category_name] = undefined;
  });
  return paramList;
};

export type RootStackParamList = ReturnType<typeof generateRootStackParamList>;

const CategoryTabs = () => {
  return (
    <MaterialTopTabs.Navigator
      tabBarPosition='top'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicator: () => null,
        // tabBar: () => null
      }}
      tabBar={props => <HeaderUser {...props} />}
    >
      <MaterialTopTabs.Screen name="LoanApplication" component={LoanApplicationScreen} />
      <MaterialTopTabs.Screen name="CreateFirm" component={CreateFirmScreen} />
    </MaterialTopTabs.Navigator>
  );
};

const UserNavigator = () => {
  const screenOptions = {
    tabBarShowLabel: true,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: 60,
      borderRadius: 10,
      backgroundColor: 'rgba(241,246,249, 0.98)',
    } as ViewStyle,
    tabBarIconStyle: {
      margin: 0,
      padding: 0
    } as ViewStyle,
    tabBarLabelStyle: {
      fontSize: 12,
      marginTop: -6,
      marginBottom: 8,
      padding: 0,
    } as TextStyle,
  };

  return (
    <BottomTab.Navigator screenOptions={screenOptions}>
      <BottomTab.Screen
        name="Home"
        component={CategoryTabs}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={30}
              color={focused ? COLORS.tungfamBgColor : COLORS.black}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="You"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={30}
              color={focused ? COLORS.tungfamBgColor : COLORS.black}
            />
          ),
        }}
      />
      
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStack}
        options={({ route }) => ({
          tabBarStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        })}
      />
    </BottomTab.Navigator>
  )
};

export default UserNavigator;

const styles = StyleSheet.create({
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 14,
    backgroundColor: COLORS.tungfamBgColor,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
  },
});
