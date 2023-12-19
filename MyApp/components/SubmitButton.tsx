import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import React from 'react';
import {COLORS} from '../constants';

interface SubmitButtonProps extends TouchableOpacityProps {
    title: string;
    color?: string;
  }

const SubmitButton: React.FC<SubmitButtonProps> = props => {
  const enabledBgColor = props.color || COLORS.tungfamDarkNavyblue;
  const disabledBgColor = COLORS.tungfamPurple;
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
          color: props.disabled
            ? COLORS.tungfamDisabled
            : COLORS.tungfamPurple,
          ...styles.text,
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
    fontFamily: "regular",
    fontSize: 15,
    fontWeight: '600',
  },
});
