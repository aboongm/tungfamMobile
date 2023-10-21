import axios from 'axios';
import {authenticate, logOut} from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from './userActions';

import {API_URL} from "@env"

let timer;

export const signUp = (firstName, lastName, email, password) => {};

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
