import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useCallback, useState, useReducer, useEffect } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PageContainer from '../components/PageContainer';
import Input from '../components/Input';
import { validateInput } from '../redux/actions/formAction';
import SubmitButton from '../components/SubmitButton';
import { COLORS } from '../constants';
import { updateSignInUserData, userLogout } from '../redux/actions/authActions';
import { updateLoggedInSignInUserData } from '../redux/slices/auth/authSlice';
import { reducer } from '../redux/reducers/formReducer';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import profilePlaceholder from '../assets/images/userImage.jpeg'
import ImagePicker from 'react-native-image-crop-picker';

const ProfileScreen = props => {
  const dispatch = useDispatch();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.auth.userData);
  const [name, setName] = useState(userData.name || '');
  const [password, setPassword] = useState(userData.password || '');
  const [mobile, setMobile] = useState(userData.mobile || '');
  const [address, setAddress] = useState(userData.address || '');
  const [selectedImage, setSelectedImage] = useState(null);

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


  // const hasChanges = () => {
  //   const currentValues = formState.inputValues;
  //   return (
  //     currentValues.name !== name ||
  //     currentValues.mobile !== mobile ||
  //     currentValues.address !== address ||
  //     currentValues.password !== password
  //   );
  // };

  const saveHandler = useCallback(async () => {
    const updateValues = formState.inputValues;
    try {
      setIsLoading(true);
      updateValues.user_image = selectedImage ? selectedImage.uri : userData.user_image;
      // updateValues.aadhar_image = formState.inputValues.aadhar_image;
      await dispatch<any>(updateSignInUserData(userData.user_id, updateValues));
      dispatch(updateLoggedInSignInUserData({ newData: updateValues }));
      // console.log("dispatch updateLoggedInSignInUserdata", updateValues);
      // console.log("userDataupdateLoggedInSignInUserdata", userData);

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

  const showImagePickerOptions = () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image Source',
        'Choose the source of the image',
        [
          {
            text: 'Camera',
            onPress: () => resolve(true),
          },
          {
            text: 'Gallery',
            onPress: () => resolve(false),
          },
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    });
  };

  const handleImagePick = async () => {
    try {
      const options = {
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: true,
      };

      const isCamera = await showImagePickerOptions();

      let image;
      if (isCamera) {
        // Capture image from camera
        image = await ImagePicker.openCamera(options);
      } else {
        // Select image from gallery
        image = await ImagePicker.openPicker(options);
      }

      setSelectedImage({
        uri: image.path,
        width: image.width,
        height: image.height,
      });

      const token = await AsyncStorage.getItem('token');
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Content-Disposition': 'form-data',
        Authorization: token,
      };

      const data = new FormData();
      data.append('aadhar', userData.aadhar);
      data.append('aadhar_image', userData.aadhar_image);
      data.append('address', userData.address);
      data.append('care_of', userData.care_of);
      data.append('email', userData.email);
      data.append('firm_id', userData.firm_id);
      data.append('mobile', userData.mobile);
      data.append('name', userData.name);
      data.append('role', userData.role);
      data.append('user_id', userData.user_id);
      data.append('user_name', userData.user_name);
      data.append('user_image', {
        uri: image.path,
        type: image.mime,
        name: image.filename || 'image.jpg',
      });
      console.log('data: ', data);
      console.log('selectedImage>>>: ', selectedImage);

      const response = await axios.put(`${API_URL}/users/${userData.user_id}`, data, { headers });
      console.log('Image upload response:', response.data);

      // Clean up temporary images after handling
      ImagePicker.clean().then(() => {
        console.log('Removed all tmp images from the tmp directory');
      }).catch(e => {
        console.error('Error cleaning temporary images:', e);
      });

    } catch (error) {
      console.error('Image picker error:', error);
    }
  };



  const updatedApiEndpoint = API_URL.split("/").slice(0, 3).join("/");

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.8)', 'rgba(52, 152, 219, 0.65)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <PageContainer style={styles.container}>
        <View style={styles.topPane}>
          <Text style={styles.profileText}>{userData.name}</Text>
          <SubmitButton
            title="Logout"
            onPress={() => dispatch<any>(userLogout())}
            style={styles.logOutButton}
            color={COLORS.tungfamBgColor}
          />
        </View>
        <View style={styles.ProfileImageContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={userData.user_image ? { uri: `${updatedApiEndpoint}/images/users/${userData.user_image}` } : profilePlaceholder}
              style={styles.image}
            />
            <TouchableOpacity onPress={handleImagePick} style={styles.edit}>
              <FontAwesome name="pencil" size={20} color={COLORS.tungfamDarkBlue} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            {/* <Text style={styles.profileText}>{userData.name}</Text> */}
            <View style={styles.iconTextContainer}>
              <FontAwesome name="user-o" size={20} color={COLORS.tungfamDarkBlue} />
              <Text style={styles.iconText}>{userData.user_name}</Text>
            </View>
            <View style={styles.iconTextContainer}>
              <FontAwesome name="envelope-o" size={20} color={COLORS.tungfamDarkBlue} />
              <Text style={styles.iconText}>{userData.email}</Text>
            </View>
            <View style={styles.iconTextContainer}>
              <FontAwesome name="id-card-o" size={20} color={COLORS.tungfamDarkBlue} />
              <Text style={styles.iconText}>Aadhar: {userData.aadhar}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.profileContainer}>
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
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  topPane: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'lightgrey',
    padding: 4,
    marginBottom: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
  },
  formContainer: {
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    marginBottom: 12,
    width: '100%',
  },
  logOutButtonContainer: {
    // position: 'absolute',
    // top: -60,
    // right: 10,
    // zIndex: 999, // Ensure the logout button is on top of other content
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the background color and opacity as needed
  },
  logOutButton: {
    // marginTop: 80,
  },
  infoContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginBottom: 6,
    color: COLORS.tungfamDarkBlue
  },
  iconText: {
    fontSize: 14,
    marginLeft: 10,
    color: COLORS.black
  },
  ProfileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingBottom: 20,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 80,
    marginRight: 20,
    width: 110,
    height: 110,
    padding: 4,
    backgroundColor: 'rgba(52, 152, 219, 0.35)',
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 0.3,
    textAlign: 'center',
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  edit: {
    position: "absolute",
    right: -10,
    bottom: 40,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 80,
    width: 30,
    padding: 5,
    backgroundColor: 'lightgrey'
  },
});

