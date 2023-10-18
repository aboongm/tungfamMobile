import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigator from './MainNavigator'
import { useSelector } from 'react-redux'
import AuthScreen from './screens/AuthScreen'
import StartUpScreen from './screens/StartUpScreen'


const AppNavigator = (props) => {

  const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "")
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin)

  return (
    <NavigationContainer>
      <AuthScreen />
      {/* {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />} */}
    </NavigationContainer>
  )
}

export default AppNavigator