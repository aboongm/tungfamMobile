import { StyleSheet, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import { COLORS } from '../constants'

const SubmitButton = (props) => {
  const enabledBgColor = props.color || COLORS.primary
  const disabledBgColor = COLORS.lightGrey
  const bgColor = props.disabled ? disabledBgColor : enabledBgColor

  return (
    <TouchableOpacity 
        onPress={props.disabled ? () => {} : props.onPress} 
        style={{
            ...styles.button, 
            ...props.style,
            ...{backgroundColor: bgColor}
        }}
    >
      <Text style={{color: props.disabled ? COLORS.grey : "white"}}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default SubmitButton

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
}
})