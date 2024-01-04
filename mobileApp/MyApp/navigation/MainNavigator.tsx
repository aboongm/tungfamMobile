import React from 'react'
import { ViewStyle } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS } from '../constants'
import ProfileScreen from './screens/ProfileScreen'
import CreateFirmScreen from './screens/CreateFirmScreen'
import ActivitiesScreen from './screens/ActivitiesScreen'
import AdminApprovalScreen from './screens/AdminApprovalScreen'
import AddLoanTypeScreen from './screens/AddLoanTypeScreen'
import LoanApplicationScreen from './screens/LoanApplicationScreen'
import PaymentScheduleScreen from './screens/PaymentScheduleScreen'
import InvestmentsScreen from './screens/InvestmentsScreen';


const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const screenOptions = {
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
      position: "absolute",
      bottom: 1,
      right: 12,
      left: 12,
      elevation: 0,
      height: 60,
      borderRadius: 10,
      // borderWidth: 1,
      // borderColor: COLORS.tungfamGrey,
      backgroundColor: COLORS.white
    } as ViewStyle,
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
                size={30}
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
                size={30}
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
          name="CreateFirm"
          component={CreateFirmScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="AdminApproval"
          component={AdminApprovalScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="AddLoanType"
          component={AddLoanTypeScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="LoanApplication"
          component={LoanApplicationScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="PaymentSchedule"
          component={PaymentScheduleScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="Investments"
          component={InvestmentsScreen}
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
