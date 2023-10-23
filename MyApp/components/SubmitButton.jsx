import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../constants';

const SubmitButton = props => {
  const enabledBgColor = props.color || COLORS.tungfamWhite;
  const disabledBgColor = COLORS.tungfamDarkerWhite;
  const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

  return (
    <TouchableOpacity
      onPress={props.disabled ? () => {} : props.onPress}
      style={{
        ...styles.button,
        ...props.style,
        ...{backgroundColor: bgColor},
      }}>
      <Text
        style={{
          ...styles.text,
          color: props.disabled
            ? COLORS.tungfamDisabled
            : COLORS.tungfamPurple,
        }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: "900",
    fontSize: 16,
    fontWeight: '900',
  },
});
