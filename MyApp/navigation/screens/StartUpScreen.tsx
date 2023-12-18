import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS, commonStyles } from '../../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { authenticate, setDidTryAutoLogin } from '../../store/authSlice'
import { getUserData } from '../../redux/actions/userActions'

const StartUpScreen = () => {
  const dispatch = useDispatch()
 
  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem("userData")
      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin())
        return
      }

      const parsedData = JSON.parse(storedAuthInfo)
      const {token, userId, expiryDate: expiryDateString} = parsedData

      const expiryDate = new Date(expiryDateString)
      if (expiryDate <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin())
        return
      }
      const userData = await getUserData(userId)
      dispatch(authenticate({token: token, userData}))
    }
    tryLogin()
  }, [dispatch])

  return (
    <View style={commonStyles.center}>
      <ActivityIndicator size={80} color={COLORS.tungfamLightBlue} />
      <Text style={styles.text}>Please Wait ...</Text>
    </View>
  )
}

export default StartUpScreen

const styles = StyleSheet.create({
  text: {
    marginTop: 15,
    color: COLORS.tungfamLightBlue,
    fontSize: 16
  }
})