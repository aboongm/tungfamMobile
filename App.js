import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
// import { customFonts } from './fonts/Fonts';
import SplashScreen from "react-native-splash-screen";

function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Load custom fonts
        customFonts = {
          black: "Roboto-Black",
          blackItalic: "Roboto-BlackItalic",
          bold: "Roboto-Bold",
          boldItalic: "Roboto-BoldItalic",
          italic: "Roboto-Italic",
          light: "Roboto-Light",
          lightItalic: "Roboto-LightItalic",
          medium: "Roboto-Medium",
          mediumItalic: "Roboto-MediumItalic",
          regular: "Roboto-Regular",
          thin: "Roboto-Thin",
          thinItalic: "Roboto-ThinItalic",
        };
      } catch (error) {
        console.error(error);
      } finally {
        setAppIsLoaded(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    // Hide the splash screen after app is loaded
    if (appIsLoaded) {
      SplashScreen.hide();
    }
  }, [appIsLoaded]);

  if (!appIsLoaded) {
    return null;
  }

  return (
    <SafeAreaView >
      <View>
        <Text style={styles.text}>Start Page</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: customFonts.bold,
    fontSize: 24,
    color: 'red'
  }
});

export default App;
