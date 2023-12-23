import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useCallback, useState, useReducer } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PageTitle from '../../components/PageTitle';
import PageContainer from '../../components/PageContainer';
import Input from '../../components/Input';
import { validateInput } from '../../redux/actions/formAction';
import SubmitButton from '../../components/SubmitButton';
import { COLORS } from '../../constants';
import { updateSignInUserData, userLogout } from '../../redux/actions/authActions';
import { updateLoggedInSignInUserData } from '../../redux/slices/auth/authSlice';
import { reducer } from '../../redux/reducers/formReducer';
import ProfileImage from '../../components/ProfileImage';
import AadharImagePicker from '../../components/AadharImagePicker';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = props => {
  const dispatch = useDispatch();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const [name, setName] = useState(userData.name || '');
  const [password, setPassword] = useState(userData.password || '');
  // const [aadharImage, setAadharImage] = useState(userData.aadhar_image || '');
  const [mobile, setMobile] = useState(userData.mobile || '');
  const [address, setAddress] = useState(userData.address || '');
  // const name = userData.name || '';
  // const password = userData.password || '';
  // const aadhar_image = userData.aadhar_image || '';
  // const mobile = userData.mobile || '';
  // const address = userData.address || '';

  const initialState = {
    inputValues: { name, aadhar_image: mobile, address, password },
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


  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return (
      currentValues.name !== name ||
      currentValues.mobile !== mobile ||
      currentValues.address !== address ||
      currentValues.password !== password
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
    <LinearGradient
    colors={['rgba(255, 255, 255, 0.8)', 'rgba(52, 152, 219, 0.65)']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <PageContainer style={styles.container}>
        <PageTitle text="Personal" />
        <View style={styles.logOutButtonContainer}>
          <SubmitButton
            title="Logout"
            onPress={() => dispatch<any>(userLogout())}
            style={styles.logOutButton}
            color={COLORS.TungfamBgColor}
          />
        </View>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.profileContainer}>
            <ProfileImage size={100} userId={userData.userId} uri={userData.profilePicture} />

            <View style={{ marginTop: 20 }}>
              {showSuccessMessage && <Text>Saved</Text>}
              <View style={styles.infoContainer}>
                <View style={styles.iconTextContainer}>
                  <FontAwesome name="user-o" size={24} color={COLORS.tungfamDarkBlue} />
                  <Text style={styles.iconText}>Username: {userData.user_name}</Text>
                </View>
                <View style={styles.iconTextContainer}>
                  <FontAwesome name="envelope-o" size={24} color={COLORS.tungfamDarkBlue} />
                  <Text style={styles.iconText}>Email: {userData.email}</Text>
                </View>
                <View style={styles.iconTextContainer}>
                  <FontAwesome name="id-card-o" size={24} color={COLORS.tungfamDarkBlue} />
                  <Text style={styles.iconText}>Aadhar: {userData.aadhar}</Text>
                </View>
              </View>

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
                onSave={saveHandler}
                hasChanges={name}
              />

              {/* <Input
              id="password"
              label="Password"
              iconPack={Ionicons}
              icon={"lock-closed"}
              iconSize={24}
              onInputChanged={inputChangeHandler}
              autoCapitalize="none"
              errorText={formState.inputValidities["password"]}
              initialValue={userData.password}
              onSave={saveHandler}
              hasChanges={password}
            /> */}

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
                onSave={saveHandler}
                hasChanges={address}
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
                onSave={saveHandler}
                hasChanges={mobile}
              />
              {/* <AadharImagePicker onImageSelected={handleAadharImageSelection} /> */}

              {/* {isLoading ? (
              <ActivityIndicator style={{ marginTop: 10 }} size={'small'} color={COLORS.tungfamLightBlue} />
            ) : (
              hasChanges() && (
                <SubmitButton title="Save" onPress={saveHandler} disabled={!formState.formIsValid} style={styles.button} />
              )
            )} */}
            </View>
          </View>

        </ScrollView>
      </PageContainer>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: COLORS.tungfamGrey,
    // margin: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  formContainer: {
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    // alignItems: "center",
    marginBottom: 12,
    width: '100%',
  },
  logOutButtonContainer: {
    position: 'absolute',
    top: -60,
    right: 10,
    zIndex: 999, // Ensure the logout button is on top of other content
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the background color and opacity as needed
  },
  logOutButton: {
    marginTop: 80,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color: COLORS.tungfamDarkBlue
  },
  iconText: {
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.tungfamDarkBlue
  },
});

