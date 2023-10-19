import { ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import Feather from 'react-native-vector-icons/Feather'
import { useDispatch } from "react-redux";
import { COLORS } from "../constants";
import { signIn } from "../redux/actions/authActions";
import { validateInput } from "../redux/actions/formAction";
import { reducer } from "../redux/reducers/formReducer";
import SubmitButton from "./SubmitButton";
import Input from "./Input";

let isTestMode = true

const initialState = {
  inputValues: {
    email: isTestMode? "aboong@punfam.in" : "",
    password: isTestMode? "password" : "",
  },
  inputValidities: {
    email: false,
    password: false
  },
  formIsValid: isTestMode? true : false
}

const SignInForm = () => {

  const dispatch = useDispatch()

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState)

  
  const inputChangeHandler = useCallback((inputId, inputValue) => {
    const result = validateInput(inputId, inputValue);
    dispatchFormState({ inputId, validationResult: result, inputValue });
  },[dispatchFormState]);
  
  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      )
      setError(null);
      await dispatch(action);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  },[dispatch, formState]);


  return (
    <>
      <Input 
        id="email"
        label="Email" 
        iconPack={Feather} 
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
        iconPack={Feather}
        icon={"lock"}
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
          size={80}
          color={COLORS.secondary}
        />
      ) : (
      <SubmitButton
        title="Sign in"
        onPress={authHandler}
        disabled={!formState.formIsValid}
        style={{ marginTop: 20 }}
      />
      )}
    </>
  )
}

export default SignInForm
