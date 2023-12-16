import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import React, { useCallback, useState, useReducer } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PageTitle from '../../components/PageTitle';
import PageContainer from '../../components/PageContainer';
import Input from '../../components/Input';
import { validateInput } from '../../redux/actions/formAction';
import SubmitButton from '../../components/SubmitButton';
import { COLORS } from '../../constants';
import { updateSignInUserData, userLogout } from '../../redux/actions/authActions';
import { updateLoggedInSignInUserData } from '../../store/authSlice';
import { reducer } from '../../redux/reducers/formReducer';
import ProfileImage from '../../components/ProfileImage';
import AadharImagePicker from '../../components/AadharImagePicker';


const ProfileScreen = props => {
  const dispatch = useDispatch();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const name = userData.name || '';
  // const password = userData.password || '';
  const aadhar_image = userData.aadhar_image || '';
  const mobile = userData.mobile || '';
  const address = userData.address || '';

  const initialState = {
    inputValues: { name, aadhar_image, mobile, address },
    inputValidities: { name: undefined, email: undefined },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangeHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState],
  );

  const handleAadharImageSelection = (selectedImage: { uri: any; }) => {
    // const selectedURI = selectedImage.uri.toString();
    // const updatedValues = {
    //   ...formState.inputValues,
    //   aadhar_image: selectedURI, // Update the aadhar_image field with the selected image URI
    // };
    // // console.log('Updated Values:', updatedValues);
    // dispatchFormState({
    //   inputId: 'aadhar_image',
    //   validationResult: true,
    //   inputValue: selectedURI,
    // });

    // dispatchFormState({
    //   inputId: 'updatedValues',
    //   validationResult: true,
    //   inputValue: updatedValues,
    // });
    // console.log('Selected Image:', selectedImage);
    // console.log('Updated Values:', updatedValues);
    // const updatedUserData = {
    //   ...userData,
    //   ...updatedValues, // Update the aadhar field in userData with the updatedValues
    // };
    // console.log('Updated UserData:', updatedUserData.aadhar_image);
  };


  const hasChanges = () => {
    const currentValues = formState.inputValues;
    console.log("userData.aadhar_image>>>", currentValues);
    console.log("aadhar_image", aadhar_image);

    console.log("Type of currentValues.aadhar_image:", typeof currentValues.aadhar_image);
    console.log("Type of aadhar_image:", typeof aadhar_image);

    // const selectedURI = aadhar_image ? aadhar_image.uri.toString() : '';   
    return (
      currentValues.name !== name ||
      currentValues.mobile !== mobile ||
      currentValues.address !== address ||
      currentValues.aadhar_image !== aadhar_image
      // currentValues.password !== password ||
      // currentValues.care_of !== care_of ||
      // currentValues.firm_id !== firm_id
    );
  };

  const saveHandler = useCallback(async () => {
    console.log("saveHandler");

    const updateValues = formState.inputValues;
    try {
      setIsLoading(true);
      // updateValues.aadhar_image = formState.inputValues.aadhar_image;
      await dispatch<any>(updateSignInUserData(userData.user_id, updateValues));
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





  return (
    <PageContainer style={styles.container}>
      <PageTitle text="Personal" />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.profileContainer}>
          <ProfileImage
            size={100}
            userId={userData.userId}
            uri={userData.profilePicture}
          />

          <View style={{ marginTop: 20 }}>
            {showSuccessMessage && <Text>Saved</Text>}
            <Input
              id="name"
              label="Name as on Aadhar"
              iconPack={FontAwesome}
              icon={"user-o"}
              iconSize={24}
              onInputChanged={inputChangeHandler}
              autoCapitalize="none"
              errorText={formState.inputValidities["name"]}
              initialValue={userData.name}
            />
            <Input
              id="address"
              label="Address"
              iconPack={FontAwesome}
              icon={"address-book"}
              iconSize={24}
              onInputChanged={inputChangeHandler}
              autoCapitalize="none"
              errorText={formState.inputValidities["address"]}
              initialValue={userData.address}
            />
            <Input
              id="mobile"
              label="Mobile"
              iconPack={FontAwesome6}
              icon={"mobile-screen"}
              iconSize={24}
              onInputChanged={inputChangeHandler}
              autoCapitalize="none"
              errorText={formState.inputValidities["mobile"]}
              initialValue={userData.mobile}
            />
            {/* <AadharImagePicker onImageSelected={handleAadharImageSelection} /> */}

            {isLoading ? (
              <ActivityIndicator
                style={{ marginTop: 10 }}
                size={'small'}
                color={COLORS.tungfamLightBlue}
              />
            ) : (
              hasChanges() && (
                <SubmitButton
                  title="Save"
                  onPress={saveHandler}
                  disabled={!formState.formIsValid}
                  style={styles.button}
                />
              )
            )}
          </View>
        </View>

        <View>
          <Text>Edit yout personal details!</Text>
        </View>
        <SubmitButton
          title="Logout"
          onPress={() => dispatch<any>(userLogout())}
          style={styles.button}
          color={COLORS.TungfamBgColor}
        />
      </ScrollView>
    </PageContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.tungfamGrey,
    margin: 4,
  },
  formContainer: {
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    // alignItems: "center",
    marginBottom: 12,
  },
  button: {
    marginTop: 80,
  }
});

