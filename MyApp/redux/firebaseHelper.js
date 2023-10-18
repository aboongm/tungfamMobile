// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBfxuwtgxv0Kl3xD5dsVYYIe13oTSshBWU",
    authDomain: "whatsapp-e17c2.firebaseapp.com",
    projectId: "whatsapp-e17c2",
    storageBucket: "whatsapp-e17c2.appspot.com",
    messagingSenderId: "659947487090",
    appId: "1:659947487090:web:9e63d566792ff6ae8127eb",
    measurementId: "G-L13WVLTH94",
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};