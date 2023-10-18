import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome"

const ActivitiesScreen = () => {
  return (
    <View>
      <Text>ActivitiesScreen</Text>
      <Text>
        <Icon name="user" size={50} color="red" />
      </Text>
    </View>
  )
}

export default ActivitiesScreen

const styles = StyleSheet.create({})