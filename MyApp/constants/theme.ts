
import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');
import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db"
  },
});

const COLORS = {
  TungfamBgColor: "#3498db",
  tungfamWhite: "#e2e9eb",
  tungfamDarkerWhite: "#c4ced1",
  tungfamDarkNavyblue: '#193b59',
  tungfamDarkBlue1: '#2f4659',
  tungfamLightBlue: '#c4ddf2',
  tungfamTorquoise: '#2cb1bf',
  tungfamTorquoiseLight: '#77f2f2',
  tungfamPurple: "#a7c0f2",
  tungfamBeige: "#f2e8d5",
  tungfamBrick: "#d95959",
  tungfamGrey: "#95b3bf",
  tungfamDarkBlue: "#45718c",
  tungfamDarkerBlue: "#395d73",

  tungfamWarning: "#f24444",
  tungfamDisabled: "#718c6d",

  // primary: "#2A4D50",
  primary: "#32d48e",
  secondary: "#8acbff",
  // secondary: "#DDF0FF",
  tertiary: "#FF7754",

  gray: "#83829A",
  gray2: "#C1C0C8",
  grey: "#718c6d",
  lightGrey: "#bdc3c7",

  white: "#FFFFFF",
  offwhite: "#F3F4F8",
  nearlyWhite: "#f4f8f7",

  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",

  textColor: '#1c1e21',
};


const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  height,
  width
};


const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};


export { COLORS, SIZES , SHADOWS, commonStyles };
