import axios from 'axios';
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { setEmployees } from '../slices/employees/employeesSlice'; 

export interface Employee {
    employee_firm_id: string;
    firm_id: string;
    position: string;
    user_id: string;
    userDetails: {
      aadhar: string;
      aadhar_image: string;
      address: string;
      email: string;
      mobile: string;
      name: string;
      role: string;
      user_id: string;
      user_name: string;
  
    }
    // Add other employee properties here
  }
  
export const fetchEmployees = (firmDetails: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.get<Employee[]>(`${API_URL}/employeefirm/`, { headers });

      if (response.status === 200) {
        const employeesData = response.data;
        const updatedEmployeesData: Employee[] = [];

        for (const employee of employeesData) {
          if (firmDetails && employee.firm_id === firmDetails.firm_id) {
            const userDetails = await fetchUserDetails(employee.user_id, headers);
            if (userDetails) {
              updatedEmployeesData.push({
                ...employee,
                userDetails: userDetails ? userDetails : {}
              });
            }
          }
        }

        dispatch(setEmployees(updatedEmployeesData));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Handle error scenarios or dispatch an action
    }
  };
};

const fetchUserDetails = async (userId: string, headers: any) => {
  try {
    const userResponse = await axios.get(`${API_URL}/users/${userId}`, { headers });
    if (userResponse.status === 200) {
      return userResponse.data; // Return user details
    }
  } catch (error) {
    console.error(`Error fetching user details for user ID ${userId}:`, error);
    return null;
  }
};
