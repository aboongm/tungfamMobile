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
import PageContainer from '../../components/PageContainer';
import logo from "../../../assets/images/logo.png";
import SignUpForm from '../../components/SignUpForm';
import SignInForm from '../../components/SignInForm';
import { COLORS } from '../../constants';

const AuthScreen = () => {
    const [isSignUp, setIsSignUp] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
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

            <TouchableOpacity
              onPress={() => setIsSignUp((prev) => !prev)}
              style={styles.linkContainer}
            >
              <Text style={styles.link}>{`Switch to ${
                !isSignUp ? "sign up" : "sign in"
              }`}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      linkContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
      },
      link: {
        color: COLORS.black,
        fontFamily: "medium",
        letterSpacing: 0.3,
      },
      imageContainer: {
        justifyContent: "center",
        alignItems: "center",
      },
      image: {
        width: "50%",
      },
      keyboardAvoidingView: {
        flex: 1,
        justifyContent: "center"
      }
})