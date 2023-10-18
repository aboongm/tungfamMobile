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
import SplashScreen from "react-native-splash-screen";
import { customFonts } from './fonts/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Load custom fonts
        // await loadCustomFonts();
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
        <Text style={{
          fontFamily: customFonts.thin,
          fontSize: 24,
          color: 'red'
        }}>Start Page</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    color: "black",
    fontSize: 18,
    fontFamily: "regular",
  },
});

export default App;
