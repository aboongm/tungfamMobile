import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate, logOut } from '../slices/auth/authSlice';
import { Dispatch } from 'redux';
import { setFirmData } from '../slices/headerSlice';

interface MaroopData {
  maroop_id: number,
  name: string,
  start_date: Date,
  created_at: Date
}

export const getMaroopData = async (firmId: string): Promise<MaroopData | void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = {
      Authorization: `${token}`,
    };

    const maroopResponse = await axios.get(`${API_URL}/firms/${firmId}/maroops/`, { headers });

    if (maroopResponse.status === 200) {
      return maroopResponse.data
    }

  } catch (error) {
    console.error(error);
  }
};

export const getMaroopUserData = async (maroopId: string): Promise<MaroopData | void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = {
      Authorization: `${token}`,
    };

    const maroopResponse = await axios.get(`${API_URL}/maroopusers/${maroopId}`, { headers });

    if (maroopResponse.status === 200) {
      return maroopResponse.data
    }

  } catch (error) {
    console.error(error);
  }
};

