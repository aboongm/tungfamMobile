import React, { FC, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TextStyle, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS } from "../constants";
import IonIcons from 'react-native-vector-icons/Ionicons';

type InputProps = {
  initialValue: string;
  id: string;
  label: string;
  style?: TextStyle;
  icon?: string;
  iconSize?: number;
  iconPack?: FC<{ name: string; size?: number; style?: ViewStyle }>;
  errorText?: string[];
  onInputChanged: (id: string, value: string) => void;
  onSave: () => void;
  hasChanges: boolean;
};

const Input: FC<InputProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const onChangeText = (text: string) => {
    setValue(text);
    props.onInputChanged(props.id, text);
  };

  const onSavePress = () => {
    if (props.hasChanges) {
      props.onSave();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[props.style, styles.label]}>{props.label}</Text>

      <View style={styles.inputContainer}>
        {props.icon && props.iconPack && (
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 15}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
        />
        {props.hasChanges && (
          <TouchableOpacity onPress={props.onSave}>
            <IonIcons name="save-sharp" size={24} color={COLORS.tungfamDarkBlue} />
          </TouchableOpacity>
        )}
      </View>

      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
    fontSize: 15,
    fontWeight: "400",
    letterSpacing: 0.3,
    color: COLORS.tungfamDarkBlue,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: 'rgba(52, 152, 219, 0.20)',
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: COLORS.tungfamDarkerBlue,
  },
  input: {
    color: COLORS.tungfamDarkerBlue,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: COLORS.tungfamWarning,
    fontSize: 15,
    fontWeight: '800',
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
});
