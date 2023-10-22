import axios from 'axios';
import {authenticate, logOut} from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from './userActions';

import {API_URL} from "@env"

let timer;

export const signUp = (username, aadhar, mobile, email, password) => {
  return async (dispatch) => {
    try {
      const requestData = {
        username,
        aadhar,
        mobile,
        email,
        password,
      };

      // Send a POST request to your API's sign-up endpoint
      axios
        .post(`${API_URL}/signup`, requestData)
        .then((response) => {
          if (response.data.user && response.data.token) {
            const token = response.data.token;
            // Save the token in AsyncStorage for future requests
            AsyncStorage.setItem('token', token)
              .then(() => {
                // Fetch user data and dispatch an action to store it
                return dispatch(getUserData(response.data.user.user_id));
              })
              .then((userResponse) => {
                const userData = userResponse; // You can adapt this to match your API response structure

                // Calculate token expiration time and set a timer to auto-logout
                const expiresIn = response.data.expiresIn || 3600; // Expiration time in seconds
                const expirationTime = new Date().getTime() + expiresIn * 1000; // Convert to milliseconds
                timer = setTimeout(() => {
                  dispatch(userLogout());
                }, expiresIn * 1000);

                // Dispatch an action to authenticate the user
                dispatch(authenticate({ token, userData, expirationTime }));

                // Save user data to AsyncStorage
                return AsyncStorage.setItem('userData', JSON.stringify(userData));
              })
              .catch((error) => {
                console.error('Error saving user data:', error);
              });
          } else {
            throw new Error('Token not found in response');
          }
        })
        .catch((error) => {
          console.error('Sign-Up Error:', error);
        });
    } catch (error) {
      console.error('Sign-Up Error:', error);
    }
  };
};



export const signIn = (email, password) => {
  return async (dispatch) => {
    try {
      const requestData = {
        email,
        password,
      };

      // Send a POST request to your API's sign-in endpoint
      const response = await axios.post(`${API_URL}/signin`, requestData);
      
      const token = response.data.token;

      // Save the token in AsyncStorage for future requests
      await AsyncStorage.setItem('token', token);

      // Fetch user data and dispatch an action to store it
      const userResponse = await dispatch(getUserData(response.data.id));
      // console.log("userResponse: ", userResponse);
      // Optionally, you can return the user data to the caller if needed
      return userResponse;
    } catch (error) {
      console.error('Sign-In Error:', error);
      console.error('Error Response:', error.response); // Log the response data
      console.error('Error Message:', error.message); // Log the error message
      throw error;
    }
  };
};


export const userLogout = () => {
  return async dispatch => {
    AsyncStorage.clear();
    clearTimeout(timer);
    dispatch(logOut());
  };
};

export const updateSignInUserData = async (userId, newData) => {};

const createUser = async (firstName, lastName, email, userId) => {};

const saveDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    }),
  );
};
