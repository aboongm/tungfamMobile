import FontAwesome from "react-native-vector-icons/FontAwesome"
import Feather from "react-native-vector-icons/Feather"
import React, { useCallback, useState, useReducer } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import PageTitle from '../../components/PageTitle'
import PageContainer from '../../components/PageContainer'
import Input from '../../components/Input'
import { validateInput } from '../../redux/actions/formAction'
import { useDispatch, useSelector } from 'react-redux'
import SubmitButton from '../../components/SubmitButton'
import { COLORS } from '../../constants'
import { updateSignInUserData, userLogout } from '../../redux/actions/authActions'
import { updateLoggedInSignInUserData } from '../../store/authSlice'
import { reducer } from '../../redux/reducers/formReducer'

const ProfileScreen = (props) => {

  const dispatch = useDispatch();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const firstName = userData.firstName || "";
  const lastName = userData.lastName || "";
  const email = userData.email || "";
  const about = userData.about || "";
  const initialState = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updateValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateSignInUserData(userData.userId, updateValues);
      dispatch(updateLoggedInSignInUserData({ newData: updateValues }));

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return (
      currentValues.firstName !== firstName ||
      currentValues.lastName !== lastName ||
      currentValues.email !== email ||
      currentValues.about !== about
    );
  };

  return (
    <PageContainer style={styles.container}>
      <PageTitle text="Settings" />
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* <ProfileImage 
          size={80} 
          userId={userData.userId}
          uri={userData.profilePicture}
        /> */}
        <Input
          id="firstName"
          label="First Name"
          iconPack={FontAwesome}
          icon={"user-o"}
          iconSize={24}
          onInputChanged={inputChangeHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["firstName"]}
          initialValue={userData.firstName}
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
          initialValue={userData.lastName}
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
          initialValue={userData.email}
        />

        <Input
          id="about"
          label="About"
          iconPack={FontAwesome}
          icon={"user-o"}
          iconSize={24}
          onInputChanged={inputChangeHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["about"]}
          initialValue={userData.about}
        />

        <View style={{ marginTop: 20 }}>
          {showSuccessMessage && <Text>Saved</Text>}

          {isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 10 }}
              size={"small"}
              color={COLORS.tungfamLightBlue}
            />
          ) : (
            hasChanges() && (
              <SubmitButton
                title="Save"
                onPress={saveHandler}
                disabled={!formState.formIsValid}
                style={{ marginTop: 20 }}
              />
            )
          )}
        </View>

        <SubmitButton
          title="Logout"
          onPress={() => dispatch(userLogout())}
          style={{ marginTop: 20 }}
          color={COLORS.tungfamBeige}
        />
      </ScrollView>
    </PageContainer>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: COLORS.tungfamGrey,
    borderWidth: 1,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.tungfamLightBlue,
    borderRadius: 20,
    padding: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: "center"
  }
})