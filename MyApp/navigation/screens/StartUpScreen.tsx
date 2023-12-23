import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS, commonStyles } from '../../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { authenticate, setDidTryAutoLogin } from '../../redux/slices/auth/authSlice'
import { getUserData } from '../../redux/actions/userActions'
import LinearGradient from 'react-native-linear-gradient';

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
      const { token, userId, expiryDate: expiryDateString } = parsedData

      const expiryDate = new Date(expiryDateString)
      if (expiryDate <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin())
        return
      }
      const userData = await getUserData(userId)
      dispatch(authenticate({ token: token, userData }))
    }
    tryLogin()
  }, [dispatch])

  return (
    <LinearGradient
    colors={['rgba(255, 255, 255, 0.8)', 'rgba(52, 152, 219, 0.65)']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        <ActivityIndicator size={80} color={COLORS.tungfamLightBlue} />
        <Text style={styles.text}>Please Wait ...</Text>
      </View>
    </LinearGradient>
  )
}

export default StartUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: {
    marginTop: 15,
    // color: COLORS.tungfamLightBlue,
    fontSize: 16
  }
})