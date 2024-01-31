import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import FirmOwnerNavigator from './FirmOwnerNavigator'
import { useSelector } from 'react-redux'
import AuthScreen from '../screens/AuthScreen'
import StartUpScreen from '../screens/StartUpScreen'
import { RootState } from '../redux/store'
import UserNavigator from './UserNavigator'
import BorrowerNavigator from './BorrowerNavigator'
import AdminNavigator from './AdminNavigator'


const AppNavigator = (props) => {

  const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "")
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin)
  const userRole = useSelector((state: RootState) => state.auth.userData.role);
  console.log("AppNavigator role: ", userRole);

  let mainNavigator = null;
  if (isAuth && didTryAutoLogin) {
    switch (userRole) {
      case 'firmOwner':
        mainNavigator = <FirmOwnerNavigator />;
        break;
      case 'user':
        mainNavigator = <UserNavigator />;
        break;
      case 'borrower':
      mainNavigator = <BorrowerNavigator />;
      break;
    case 'admin':
      mainNavigator = <AdminNavigator />;
      break;
      default:
        // Handle other roles or set a default navigator
        mainNavigator = <FirmOwnerNavigator />;
        break;
    }
  }
  return (
    <NavigationContainer>
      {/* <AuthScreen /> */}
      {/* {isAuth && <FirmOwnerNavigator />} */}
      {mainNavigator}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  )
}

export default AppNavigator