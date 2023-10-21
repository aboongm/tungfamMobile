import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, commonStyles } from '../../constants/theme'

const StartUpScreen = () => {
  return (
    <View style={commonStyles.center}>
      <ActivityIndicator size={80} color={COLORS.tungfamLightBlue} />
    </View>
  )
}

export default StartUpScreen

const styles = StyleSheet.create({})