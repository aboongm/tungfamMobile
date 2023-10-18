import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AppNavigator = () => {
  return (
    <View style={styles.container}>
      <Text>AppNavigator</Text>
    </View>
  )
}

export default AppNavigator

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
})