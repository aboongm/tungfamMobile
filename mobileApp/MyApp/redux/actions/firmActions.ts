import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate, logOut } from '../slices/auth/authSlice';
import { Dispatch } from 'redux';
import { setFirmData } from '../slices/HeaderSlice';

interface FirmData {
  firm_id: number,
  firm_name: string,
  address: string,
  mobile: number,
  registration:string,
  contact_person: string,
  email: string,
  website: string,
  status: string,
  created_at: Date
}

export const getFirmData = async (userId: string): Promise<FirmData | void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = {
      Authorization: `${token}`,
    };

    const userFirmResponse = await axios.get(`${API_URL}/userfirm`, { headers });

    if (userFirmResponse.status === 200 && userFirmResponse.data.length > 0) {
      const userFirms = userFirmResponse.data;
      const userFirmForId = userFirms.find((userFirm) => userFirm.user_id === userId);
      
      if (userFirmForId) {
        const firmId = userFirmForId.firm_id;
        const firmDetailsResponse = await axios.get(`${API_URL}/firms/${firmId}`, { headers });
        console.log("firmDetailsResponse: ", firmDetailsResponse.data);
        
        if (firmDetailsResponse.status === 200) {
         return firmDetailsResponse.data;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

