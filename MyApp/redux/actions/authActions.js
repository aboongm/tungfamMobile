// import { getFirebaseApp } from "../firebaseHelper";
// import {
//   createUserWithEmailAndPassword,
//   getAuth,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { child, getDatabase, ref, set, update } from "firebase/database";
import { authenticate, logOut } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "./userActions";

let timer;

export const signUp = (firstName, lastName, email, password) => {
  console.log("signUp inputs: ", firstName, lastName, email, password);
  // return async (dispatch) => {
  //   const app = getFirebaseApp();
  //   const auth = getAuth(app);

  //   // Set persistence to LOCAL to enable persistent authentication state
  //   try {
  //     const result = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const { uid, stsTokenManager } = result.user;
  //     const { accessToken, expirationTime } = stsTokenManager;

  //     const expiryDate = new Date(expirationTime);
  //     const timeNow = new Date();
  //     const millisecondsUntilExpiry = expiryDate - timeNow;

  //     timer = setTimeout(() => {
  //       dispatch(userLogout());
  //     }, millisecondsUntilExpiry);

  //     const userData = await createUser(firstName, lastName, email, uid);
  //     dispatch(authenticate({ token: accessToken, userData }));
  //     saveDataToStorage(accessToken, uid, expiryDate);
  //   } catch (error) {
  //     const errorCode = error.code;
  //     let message = "Something went wrong";

  //     if (errorCode === "auth/email-already-in-use") {
  //       message = "This email is already in use";
  //     }

  //     throw new Error(message);
  //   }
  // };
};

export const signIn = (email, password) => {
  // return async (dispatch) => {
  //   const app = getFirebaseApp();
  //   const auth = getAuth(app);

  //   // Set persistence to LOCAL to enable persistent authentication state
  //   try {
  //     const result = await signInWithEmailAndPassword(auth, email, password);
  //     const { uid, stsTokenManager } = result.user;
  //     const { accessToken, expirationTime } = stsTokenManager;

  //     const expiryDate = new Date(expirationTime);
  //     const timeNow = new Date();
  //     const millisecondsUntilExpiry = expiryDate - timeNow;

  //     timer = setTimeout(() => {
  //       dispatch(userLogout());
  //     }, millisecondsUntilExpiry);

  //     const userData = await getUserData(uid);
  //     dispatch(authenticate({ token: accessToken, userData }));
  //     saveDataToStorage(accessToken, uid, expiryDate);
  //   } catch (error) {
  //     const errorCode = error.code;
  //     console.log(errorCode);
  //     let message = "Something went wrong";

  //     if (errorCode === "auth/invalid-login-credentials") {
  //       message = "Username or password was incorrect";
  //     }

  //     throw new Error(message);
  //   }
  // };
};

export const userLogout = () => {
  // return async (dispatch) => {
  //   AsyncStorage.clear();
  //   clearTimeout(timer);
  //   dispatch(logOut());
  // };
};

export const updateSignInUserData = async (userId, newData) => {
  // if (newData.firstName && newData.lastName) {
  //   const firstLast = `${newData.firstName} ${newData.lastName}`.toLowerCase();
  //   newData.firstLast = firstLast;
  // }

  // const dbRef = ref(getDatabase());
  // const childRef = child(dbRef, `users/${userId}`);
  // await update(childRef, newData);
};

const createUser = async (firstName, lastName, email, userId) => {
  // const firstLast = `${firstName} ${lastName}`.toLowerCase();
  // const userData = {
  //   firstName,
  //   lastName,
  //   firstLast,
  //   email,
  //   userId,
  //   signUpdate: new Date().toISOString(),
  // };

  // const dbRef = ref(getDatabase());
  // const childRef = child(dbRef, `users/${userId}`);
  // await set(childRef, userData);
  // return userData;
};

const saveDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    })
  );
};
