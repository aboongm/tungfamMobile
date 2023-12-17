import axios from 'axios';
import { authenticate, logOut } from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'redux';
import { getUserData } from './userActions';

import { API_URL } from "@env"

let timer: ReturnType<typeof setTimeout> | undefined;

interface UserData {
  id: string;
  name: string;
  // Add other properties as per your user data structure
}

interface SignUpData {
  user_name: string;
  aadhar: string;
  mobile: string;
  email: string;
  password: string;
}

export const signUp = (user_name: string, aadhar: string, mobile: string, email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const requestData: SignUpData = {
        user_name,
        aadhar,
        mobile,
        email,
        password,
      };
      console.log("requestData: ", requestData);
      
      // Send a POST request to your API's sign-up endpoint
      await axios
        .post<{ user: { user_id: string }; token: string; expiresIn?: number }>(`${API_URL}/signup`, requestData)
        .then(async (response) => {
          if (response.data.user && response.data.token) {
            const token = response.data.token;

            // Save the token in AsyncStorage for future requests
            await AsyncStorage.setItem('token', token);

            // Fetch user data and dispatch an action to store it
            const userResponse = await dispatch<any>(getUserData(response.data.user.user_id));

            if (userResponse) {
              const userData: UserData = userResponse; // Adapt this to match your API response structure

              // Calculate token expiration time and set a timer to auto-logout
              const expiresIn = response.data.expiresIn || 3600; // Expiration time in seconds
              const expirationTime = new Date().getTime() + expiresIn * 1000; // Convert to milliseconds

              timer = setTimeout(() => {
                dispatch<any>(userLogout());
              }, expiresIn * 1000);

              // Dispatch an action to authenticate the user
              dispatch(authenticate({ token, userData, expirationTime }));

              // Save user data to AsyncStorage
              await AsyncStorage.setItem('userData', JSON.stringify(userData));
            } else {
              throw new Error('Error fetching user data');
            }
          } else {
            throw new Error('Token not found in response');
          }
        })
        // .catch((error) => {
        //   console.error('Sign-Up Error:', error);
        // });
    } catch (error) {
      console.error('Sign-Up Error:', error);
    }
  };
};

export const signIn = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const requestData = {
        email,
        password,
      };
      console.log("requestData: ", requestData);
      console.log("API_URL: ", API_URL);
      
      // Send a POST request to your API's sign-in endpoint
      const response = await axios.post<{ token: string; id: string }>(`${API_URL}/signin`, requestData);
      const token = response.data.token;

      // Save the token in AsyncStorage for future requests
      await AsyncStorage.setItem('token', token);

      // Fetch user data and dispatch an action to store it
      const userResponse = await dispatch<any>(getUserData(response.data.id));

      return userResponse;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Sign-In Error:', error);
            // Log the response data if available
            if (error.response) {
                console.error('Error Response:', error.response);
            }
            // Log the error message if available
            if (error.message) {
                console.error('Error Message:', error.message);
            }
            throw error;
        } else {
            console.error('Unknown error occurred:', error);
            throw new Error('Unknown error occurred');
        }
    }
  };
};

export const userLogout = () => {
  return async (dispatch: Dispatch) => {
    AsyncStorage.clear();
    if (timer) clearTimeout(timer);
    dispatch(logOut());
  };
};

export const updateSignInUserData = (userId: string, newData: any) => {
  console.log("newData");
  return async (dispatch: Dispatch) => {
    try {
      const userResponse = await dispatch<any>(getUserData(userId));
      
      console.log("userResonpse: ", await userResponse);
      console.log("newData", newData);      

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const headers = {
        // Authorization: `Bearer ${token}`,
        Authorization: `${token}`,
      };
      
      const updatedUserData = {
        ...userResponse, 
        ...newData,     
      };

      // console.log("updatedUserData", updatedUserData);
      

      const response = await axios.put(`${API_URL}/users/${userId}`, updatedUserData, { headers });

      // Check the response status or handle success/failure accordingly
      if (response.status === 200) {
        // Optionally handle success scenario, if needed
        console.log('User data updated successfully');
      } else {
        // Handle other status codes or errors
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      // Handle errors
      console.error('Error updating user data:', error);
      throw error;
    }
  }
};

export const createFirm = (firmData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const headers = {
        Authorization: `${token}`,
      };

      // Make an API call to create a new firm using firmData
      const response = await axios.post(`${API_URL}/firms`, firmData, { headers });

      // Check the response status or handle success/failure accordingly
      if (response.status === 201) {
        // Optionally handle success scenario, if needed
        console.log('Firm created successfully');
        // You might dispatch an action or perform any post-creation logic here
      } else {
        // Handle other status codes or errors
        throw new Error('Failed to create firm');
      }
    } catch (error) {
      // Handle errors
      console.error('Error creating firm:', error);
      throw error;
    }
  };
};