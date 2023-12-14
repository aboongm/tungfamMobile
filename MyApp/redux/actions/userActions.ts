import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate, logOut } from '../../store/authSlice';
import { Dispatch } from 'redux';

interface UserData {
  // Define the structure of your user data
  // Example properties:
  id: string;
  name: string;
  // Add other properties as per your user data structure
}

export const getUserData = (userId: string): ((dispatch: Dispatch) => Promise<UserData | void>) => {
  console.log("getUserData: ", userId);
  return async (dispatch: Dispatch): Promise<UserData | void> => {
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
        // Authorization: `Bearer ${token}`,
        Authorization: `${token}`,
      };
      console.log("headers: ", headers);
      

      const response = await axios.get<UserData>(`${API_URL}/users/${userId}`, { headers });
      const userData: UserData = response.data;
      console.log("userData: ", userData);
      // Update user data in the Redux store
      dispatch(authenticate({
        token, 
        userData,
        expirationTime: 0
      }));
      return userData;
    } catch (error) {
      // Handle errors, e.g., if the API request fails
      console.error('Error fetching user data:', error);
      dispatch(logOut());
    }
  };
};
