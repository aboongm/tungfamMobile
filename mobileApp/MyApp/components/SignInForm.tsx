import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
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

type FormState = {
  inputValues: {
    email: string;
    password: string;
  };
  inputValidities: {
    email: boolean;
    password: boolean;
  };
  formIsValid: boolean;
};

const initialState: FormState = {
  inputValues: {
    // email: isTestMode ? "maroop@punfam.com" : "",
    // password: isTestMode ? "maroop11" : "",
    // email: isTestMode ? "admin@punfam.com" : "",
    // password: isTestMode ? "MyPassword@11" : "",
    email: isTestMode ? "ranjitamayengbamchanu@yahoo.com" : "",
    password: isTestMode ? "neonova" : "",
    // email: isTestMode ? "loanofficer@tungfam.com" : "",
    // password: isTestMode ? "loanofficer11" : "",
    // email: isTestMode ? "sobita@tungfam.com" : "",
    // password: isTestMode ? "sobita11" : "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: isTestMode ? true : false,
};

const SignInForm = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangeHandler = useCallback((inputId: string, inputValue: string) => {
    const result = validateInput(inputId, inputValue);
    dispatchFormState({ inputId, validationResult: result, inputValue });
  }, [dispatchFormState]);

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);
      await dispatch(action);

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <View style={{ marginTop: 40}}>
      <Input
        id="email"
        label="Email"
        iconPack={Feather}
        icon="mail"
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
        icon="lock"
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
    </View>
  );
};

export default SignInForm;
