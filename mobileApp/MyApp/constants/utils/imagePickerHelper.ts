// // import * as ImagePicker from "expo-image-picker";
// import { getFirebaseApp } from "./firebaseHelper";
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   uploadBytesResumable,
// } from "firebase/storage";

// import uuid from 'react-native-uuid';
// // uuid.v4()

// export const launchImagePicker = async () => {
//   await checkMediaPermissions();

//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     aspect: [1, 1],
//     quality: 1,
//   });

//   if (!result.canceled) {
//     return result.uri;
//   }
// };

// export const uploadImageAsync = async (uri) => {
//   const app = getFirebaseApp();

//   const blob = await new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//       resolve(xhr.response);
//     };
//     xhr.onerror = function (e) {
//       console.log(e);
//       reject(new TypeError("Network request failed"));
//     };
//     xhr.responseType = "blob";
//     xhr.open("GET", uri, true);
//     xhr.send();
//   });

//   const pathFolder = "profilePics";
//   const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

//   await uploadBytesResumable(storageRef, blob);
//   blob.close();
//   return await getDownloadURL(storageRef);

//   // const fileRef = ref(getStorage(), uuid.v4());
//   // const result = await uploadBytes(fileRef, blob);
//   // // We're done with the blob, close and release it
//   // blob.close();
//   // return await getDownloadURL(fileRef);
// };

// const checkMediaPermissions = async () => {
//   0;
//   if (Platform.OS !== "web") {
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permissionResult.granted === false) {
//       return Promise.reject("We need permissions to access your photos");
//     }
//   }

//   return Promise.resolve();
// };
