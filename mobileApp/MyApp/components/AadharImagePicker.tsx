import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const AadharImagePicker = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickAadharImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
      };

      const result = await launchImageLibrary(options);

      if (!result.didCancel) {
        const selected = result.assets[0];
        setSelectedImage(selected);
        onImageSelected(selected);
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickAadharImage}>
        <View style={styles.container}>
          <Text style={styles.text}>Choose Aadhar Image</Text>
        </View>
      </TouchableOpacity>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3F51B5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});

export default AadharImagePicker;
