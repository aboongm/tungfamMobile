import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate, logOut } from '../slices/auth/authSlice';
import { Dispatch } from 'redux';

interface UserData {
  user_id: number;
  user_name: string;
  email: string;
  password: string;
  role: string;
  name?: string;
  aadhar: number;
  aadhar_image?: Buffer;
  care_of?: string;
  address?: string;
  mobile: number;
  firm_id?: number;
}

export const getUserData = (userId: string): ((dispatch: Dispatch) => Promise<UserData | void>) => {
  return async (dispatch: Dispatch): Promise<UserData | void> => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('Token is missing or expired.');
        dispatch(logOut());
        return;
      }

      const headers = {
        // Authorization: `Bearer ${token}`,
        Authorization: `${token}`,
      };

      const response = await axios.get<UserData>(`${API_URL}/users/${userId}`, { headers });
      const userData: UserData = response.data;
      // console.log("userData: ", userData);
      dispatch(authenticate({
        token, 
        userData,
        expirationTime: 0
      }));
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      dispatch(logOut());
    }
  };
};
