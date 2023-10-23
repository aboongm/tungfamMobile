import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import userImage from "../../assets/images/userImage.jpeg"
import { useDispatch } from 'react-redux';
import { updateSignInUserData } from '../redux/actions/authActions';
import { updateLoggedInSignInUserData } from '../store/authSlice';
import ImagePicker from 'react-native-image-picker'; // Import the image picker library
import { COLORS } from '../constants';

const ProfileImage = props => {
  const dispatch = useDispatch();

  const source = props.uri ? { uri: props.uri } : userImage;

  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const userId = props.userId;

  const launchImagePicker = () => {
    // Configure options for the image picker
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          reject('Image selection was canceled');
        } else if (response.error) {
          reject(response.error);
        } else {
          resolve(response.uri);
        }
      });
    });
  };

  const uploadImageAsync = async (tempUri) => {
    // Replace 'your-server-url' with the actual URL of your image upload endpoint
    const serverUrl = 'your-server-url';
    const formData = new FormData();
    formData.append('image', {
      uri: tempUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      return data.imageUrl; // Adjust the property name as needed
    } catch (error) {
      throw new Error('Could not upload image: ' + error.message);
    }
  };

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;

      // Upload the image
      setIsLoading(true);
      const uploadUri = await uploadImageAsync(tempUri);
      setIsLoading(false);

      if (!uploadUri) {
        throw new Error("Could not upload image!");
      }

      const newData = { profilePicture: uploadUri };
      await updateSignInUserData(userId, { profilePicture: uploadUri });
      dispatch(updateLoggedInSignInUserData({ newData: newData }));

      setImage({ uri: uploadUri });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      {isLoading ? (
        <View
          height={props.size}
          width={props.size}
          style={styles.loadingContainer}>
          <ActivityIndicator size={'small'} color={COLORS.primary} />
        </View>
      ) : (
        <Image
          source={image}
          style={{
            ...styles.image,
            ...{width: props.size, height: props.size},
          }}
        />
      )}

      <View style={styles.editIconContainer}>
        <FontAwesome name="pencil" size={15} color={'black'} />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    borderRadius: 50,
    borderColor: COLORS.tungfamLightBlue,
    borderWidth: 1,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.tungfamLightBlue,
    borderRadius: 20,
    padding: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
