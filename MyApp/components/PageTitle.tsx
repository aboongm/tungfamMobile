import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants'


const PageTitle = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  )
}

export default PageTitle

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    text: {
        fontFamily: 'bold',
        fontSize: 28,
        color: COLORS.tungfamLightBlue,
        letterSpacing: 0.3
    }
})