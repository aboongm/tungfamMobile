import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate, logOut } from '../../store/authSlice';

export const getUserData = userId => {
  return async dispatch => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        // Handle the case where the token is missing or expired
        console.error('Token is missing or expired.');
        // You may want to log out or perform other actions in this case.
        dispatch(logOut());
        return;
      }

      // Set the Authorization header with the token
      const headers = {
        // Authorization: `Bearer ${token}`, // Adjust the header format based on your server's requirements
        Authorization: `${token}`, // Adjust the header format based on your server's requirements
      };

      const response = await axios.get(`${API_URL}/users/${userId}`, { headers });
      const userData = response.data; // Assuming the user data is returned as JSON
      
      // Update user data in the Redux store
      dispatch(authenticate({ token, userData }));
      return userData
    } catch (error) {
      // Handle errors, e.g., if the API request fails
      console.error('Error fetching user data:', error);
      // Depending on your error handling strategy, you can take appropriate actions here.
      // For example, dispatch an action to log the user out.
      dispatch(logOut());
    }
  };
};
