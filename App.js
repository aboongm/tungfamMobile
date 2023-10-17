import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { customFonts } from './fonts/Fonts';


function App() {

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
