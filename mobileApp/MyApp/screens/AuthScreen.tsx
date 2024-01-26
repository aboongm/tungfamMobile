import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import PageContainer from '../components/PageContainer';
import logo from "../assets/images/logo.png";
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';
import { COLORS } from '../constants';
import LinearGradient from 'react-native-linear-gradient';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.8)', 'rgba(52, 152, 219, 0.65)']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1, }}>
        <PageContainer style={styles.container}>
          <ScrollView>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behaviour={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={100}
            >
              <View style={styles.imageContainer}>
                <Image source={logo} style={styles.image} resizeMode="contain" />
              </View>

              {isSignUp ? <SignUpForm /> : <SignInForm />}

              {/* <TouchableOpacity
                onPress={() => setIsSignUp((prev) => !prev)}
                style={styles.linkContainer}
              >
                <Text style={styles.link}>{`Switch to ${!isSignUp ? "sign up" : "sign in"
                  }`}</Text>
              </TouchableOpacity> */}
            </KeyboardAvoidingView>
          </ScrollView>
        </PageContainer>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.tungfamBgColor,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  link: {
    color: COLORS.tungfamBgColor,
    fontWeight: "500",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 200, // Set the maximum vertical height of the container
  },
  image: {
    height: 140, // Set the fixed height of the image
    width: "50%",
    resizeMode: "contain",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center"
  }
})