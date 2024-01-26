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
        fontFamily: '900',
        fontSize: 28,
        color: COLORS.tungfamBgColor,
        letterSpacing: 0.3,
        textAlign: 'center'
    }
})