import { StyleSheet, Text, TextInput, View } from "react-native";

import { useState } from 'react'
import { COLORS } from "../constants";

const Input = (props) => {
  const [value, setValue] = useState(props.initialValue)
  
  const onChangeText = (text) => {
    setValue(text)
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>

      <View style={styles.inputContainer}>
        {props.icon && (
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 15}
            style={styles.icon}
          />
        )}
        <TextInput
          {...props}
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
        />
      </View>

      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
    fontFamily: "bold",
    letterSpacing: 0.3,
    color: COLORS.textColor,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: COLORS.nearlyWhite,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: COLORS.grey,
  },
  input: {
    color: COLORS.textColor,
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
})