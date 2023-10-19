import { ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from "react-redux";
import { COLORS } from "../constants";
import { signUp } from "../redux/actions/authActions";
import { validateInput } from "../redux/actions/formAction";
import { reducer } from "../redux/reducers/formReducer";
import SubmitButton from "./SubmitButton";
import Input from "./Input";

const initialState = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = () => {
  
  const dispatch = useDispatch()
  
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
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
    try {
      setIsLoading(true);

      const action = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
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
      id="firstName"
      label="First Name"
      iconPack={FontAwesome}
      icon={"user-o"}
      iconSize={24}
      onInputChanged={inputChangeHandler}
      autoCapitalize="none"
      errorText={formState.inputValidities["firstName"]}
    />
    <Input
      id="lastName"
      label="Last Name"
      iconPack={FontAwesome}
      icon={"user-o"}
      iconSize={24}
      onInputChanged={inputChangeHandler}
      autoCapitalize="none"
      errorText={formState.inputValidities["lastName"]}
    />
    <Input
      id="email"
      label="Email"
      iconPack={Feather}
      icon={"mail"}
      iconSize={24}
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
