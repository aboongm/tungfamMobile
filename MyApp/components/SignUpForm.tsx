import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import { useDispatch } from "react-redux";
import { COLORS } from "../constants";
import { signUp } from "../redux/actions/authActions";
import { validateInput } from "../redux/actions/formAction";
import { reducer } from "../redux/reducers/formReducer";
import SubmitButton from "./SubmitButton";
import Input from "./Input";

let isTestMode = true

const initialState = {
  inputValues: {
    username: isTestMode ? "tungfam" : "",
    aadhar: isTestMode ? "222244446660" : "",
    mobile: isTestMode ? "1234567890" : "",
    email: isTestMode ? "support@tungfam.com" : "",
    password: isTestMode ? "password" : "",
  },
  inputValidities: {
    username: false,
    aadhar: false,
    mobile: false,
    email: false,
    password: false,
  },
  formIsValid: isTestMode? true : false
};

const SignUpForm = () => {
  
  const dispatch = useDispatch()
  
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangeHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    console.log("authHandler:");
    
    try {
      setIsLoading(true);

      console.log("username: ", formState.inputValues.username);
      

      const action = signUp(
        formState.inputValues.username,
        formState.inputValues.aadhar,
        formState.inputValues.mobile,
        formState.inputValues.email,
        formState.inputValues.password
      )
      setError(null);
      await dispatch(action);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
    <Input
      id="username"
      label="Username"
      iconPack={Ionicons}
      icon={"person"}
      iconSize={24}
      initialValue={formState.inputValues.username}
      onInputChanged={inputChangeHandler}
      autoCapitalize="none"
      errorText={formState.inputValidities["username"]}
    />
    <Input
      id="aadhar"
      label="Aadhar"
      iconPack={Ionicons}
      icon={"document"}
      iconSize={24}
      initialValue={formState.inputValues.aadhar}
      onInputChanged={inputChangeHandler}
      autoCapitalize="none"
      errorText={formState.inputValidities["aadhar"]}
    />
    <Input
      id="mobile"
      label="Mobile"
      iconPack={FontAwesome}
      icon={"mobile-screen"}
      iconSize={24}
      initialValue={formState.inputValues.mobile}
      onInputChanged={inputChangeHandler}
      autoCapitalize="none"
      errorText={formState.inputValidities["mobile"]}
    />
    <Input
      id="email"
      label="Email"
      iconPack={Ionicons}
      icon={"mail"}
      iconSize={24}
      initialValue={formState.inputValues.email}
      onInputChanged={inputChangeHandler}
      keyboardType="email-address"
      autoCapitalize="none"
      errorText={formState.inputValidities["email"]}
    />
    <Input
      id="password"
      label="Password"
      iconPack={Ionicons}
      icon={"lock-closed"}
      iconSize={24}
      initialValue={formState.inputValues.password}
      onInputChanged={inputChangeHandler}
      autoCapitalize="none"
      secureTextEntry
      errorText={formState.inputValidities["password"]}
    />
    {isLoading ? (
      <ActivityIndicator
        style={{ marginTop: 10 }}
        size={"small"}
        color={COLORS.primary}
      />
    ) : (
      <SubmitButton
        title="Sign Up"
        onPress={authHandler}
        style={{ marginTop: 20 }}
        disabled={!formState.formIsValid}
      />
    )}
  </>
  )
}

export default SignUpForm
