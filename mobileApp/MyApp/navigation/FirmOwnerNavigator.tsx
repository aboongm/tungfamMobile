// import React from 'react'
// import { ViewStyle } from 'react-native';
// import Ionicons from "react-native-vector-icons/Ionicons"
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { COLORS } from '../constants'
// import ProfileScreen from '../screens/ProfileScreen'
// import CreateFirmScreen from '../screens/CreateFirmScreen'
// import ActivitiesScreen from '../screens/ActivitiesScreen'
// import AdminApprovalScreen from '../screens/AdminApprovalScreen'
// import AddLoanTypeScreen from '../screens/AddLoanTypeScreen'
// import LoanApplicationScreen from '../screens/LoanApplicationScreen'
// import PaymentScheduleScreen from '../screens/PaymentScheduleScreen'
// import InvestmentsScreen from '../screens/InvestmentsScreen';


// const Stack = createNativeStackNavigator()
// const Tab = createBottomTabNavigator()

// const TabNavigator = () => {
//   const screenOptions = {
//     tabBarShowLabel: false,
//     tabBarHideOnKeyboard: true,
//     headerShown: false,
//     tabBarStyle: {
//       position: "absolute",
//       bottom: 1,
//       right: 12,
//       left: 12,
//       elevation: 0,
//       height: 60,
//       borderRadius: 10,
//       // borderWidth: 1,
//       // borderColor: COLORS.tungfamGrey,
//       backgroundColor: COLORS.white
//     } as ViewStyle,
//   };
//   return (
//     <Tab.Navigator screenOptions={screenOptions}>
//       <Tab.Screen
//         name="Activities"
//         component={ActivitiesScreen}
//         options={{
//           tabBarIcon: ({ focused }) => {
//             return (
//               <Ionicons
//                 name={focused ? "home" : "home-outline"}
//                 size={30}
//                 color={focused ? COLORS.TungfamBgColor : COLORS.gray2}
//               />
//             );
//           },
//         }}
//       />
//       <Tab.Screen
//         name="ProfileScreen"
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => {
//             return (
//               <Ionicons
//                 name={focused ? "person" : "person-outline"}
//                 size={30}
//                 color={focused ? COLORS.TungfamBgColor : COLORS.gray2}
//               />
//             );
//           },
//         }}
//       />
//     </Tab.Navigator>
//   )
// }

// const MainNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Group>
//         <Stack.Screen
//           name="Home"
//           component={TabNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="CreateFirm"
//           component={CreateFirmScreen}
//           options={{
//             headerTitle: "",
//             headerBackTitle: "Back",
//           }}
//         />
//         <Stack.Screen
//           name="AdminApproval"
//           component={AdminApprovalScreen}
//           options={{
//             headerTitle: "",
//             headerBackTitle: "Back",
//           }}
//         />
//         <Stack.Screen
//           name="AddLoanType"
//           component={AddLoanTypeScreen}
//           options={{
//             headerTitle: "",
//             headerBackTitle: "Back",
//           }}
//         />
//         <Stack.Screen
//           name="LoanApplication"
//           component={LoanApplicationScreen}
//           options={{
//             headerTitle: "",
//             headerBackTitle: "Back",
//           }}
//         />
//         <Stack.Screen
//           name="PaymentSchedule"
//           component={PaymentScheduleScreen}
//           options={{
//             headerTitle: "",
//             headerBackTitle: "Back",
//           }}
//         />
//         <Stack.Screen
//           name="Investments"
//           component={InvestmentsScreen}
//           options={{
//             headerTitle: "",
//             headerBackTitle: "Back",
//           }}
//         />
//       </Stack.Group>     
//     </Stack.Navigator>
//   );
// }

// export default MainNavigator


import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoanBookScreen from '../screens/homescreen/LoanBookScreen';
import InvestmentScreen from '../screens/homescreen/InvestmentScreen';
import EmployeeScreen from '../screens/homescreen/EmployeeScreen';
import LoanTypeScreen from '../screens/homescreen/LoanTypeScreen';
import CashFlowScreen from '../screens/homescreen/CashFlowScreen';
import ExpenseScreen from '../screens/homescreen/ExpenseScreen';
import PaymentScheduleScreen from '../screens/PaymentScheduleScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import AddLoanTypeScreen from "../screens/AddLoanTypeScreen"
import { getFirmData } from '../redux/actions/firmActions';
import MaroopScreen from '../screens/maroopScreen/MaroopScreen';
import HeaderMaroop from '../components/HeaderMaroop';
import CreateMaroopScreen from '../screens/maroopScreen/CreateMaroopScreen';

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

const HomeTab = () => {
  return (
    <MaterialTopTabs.Navigator
      tabBarPosition='top'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicator: () => null,
        // tabBar: () => null
      }}
      tabBar={props => <Header {...props} />}
    >
      <MaterialTopTabs.Screen name="LoanBook" component={LoanBookScreen} />
      {/* <MaterialTopTabs.Screen name="CashFlow" component={CashFlowScreen} />
      <MaterialTopTabs.Screen name="Expense" component={ExpenseScreen} />
      <MaterialTopTabs.Screen name="Investment" component={InvestmentScreen} />
      <MaterialTopTabs.Screen name="Employee" component={EmployeeScreen} />
      <MaterialTopTabs.Screen name="LoanType" component={LoanTypeScreen} /> */}
    </MaterialTopTabs.Navigator>
  );
};

const LoanTab = () => {
  return (
    <MaterialTopTabs.Navigator
      tabBarPosition='top'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicator: () => null,
        // tabBar: () => null
      }}
      tabBar={props => <Header {...props} />}
    >
      <MaterialTopTabs.Screen name="LoanBook" component={LoanBookScreen} />
      <MaterialTopTabs.Screen name="CashFlow" component={CashFlowScreen} />
      <MaterialTopTabs.Screen name="Expense" component={ExpenseScreen} />
      <MaterialTopTabs.Screen name="Investment" component={InvestmentScreen} />
      <MaterialTopTabs.Screen name="Employee" component={EmployeeScreen} />
      <MaterialTopTabs.Screen name="LoanType" component={LoanTypeScreen} />
    </MaterialTopTabs.Navigator>
  );
};

const MaroopTab = () => {
  return (
    <MaterialTopTabs.Navigator
      tabBarPosition='top'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicator: () => null,
        // tabBar: () => null
      }}
      tabBar={props => <HeaderMaroop {...props} />}
    >
      <MaterialTopTabs.Screen name="Maroops" component={MaroopScreen} />
      <MaterialTopTabs.Screen name="CreateMaroop" component={CreateMaroopScreen}/>
    </MaterialTopTabs.Navigator>
  );
};

const FirmOwnerNavigator = () => {
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
      {/* <BottomTab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={30}
              color={focused ? COLORS.tungfamBgColor : COLORS.black}
            />
          ),
        }}
      /> */}
      <BottomTab.Screen
        name="Loan"
        component={LoanTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'storefront' : 'storefront-outline'}
              size={30}
              color={focused ? COLORS.tungfamBgColor : COLORS.black}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Maroop"
        component={MaroopTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'diamond' : 'diamond-outline'}
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



export default FirmOwnerNavigator;

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
