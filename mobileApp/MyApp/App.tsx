
import React, {
  useCallback, 
  useEffect, 
  useState
} from 'react';

import SplashScreen from 'react-native-splash-screen'
import { StatusBar, StyleSheet } from 'react-native';
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';


function App(): React.JSX.Element {

  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Load custom fonts
        // await loadCustomFonts();
        SplashScreen.hide();
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(error);
      } finally {
        setAppIsLoaded(true);
      }
    };

    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      SplashScreen.hide();
    }
  }, [appIsLoaded]);


  return (
    <Provider store={store}>
    <SafeAreaProvider style={styles.container} onLayout={onLayout}>
    <StatusBar
         backgroundColor="transparent" // Set transparent to merge with LinearGradient
         barStyle="dark-content"
         translucent={true} 
    />
      <AppNavigator />
    </SafeAreaProvider>
  </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
