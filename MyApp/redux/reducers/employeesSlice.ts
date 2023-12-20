import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

interface Employee {
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

interface EmployeesState {
  employees: Employee[];
  // Add other state properties if needed
}

const initialState: EmployeesState = {
  employees: [],
  // Initialize other state properties if needed
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (firmDetails, { rejectWithValue }) => {
      try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
              throw new Error('Token not found');
          }

          const headers = {
              Authorization: `${token}`,
          };

          const response = await axios.get(`${API_URL}/employeefirm/`, { headers });

          if (response.status === 200) {
              const employeesData = response.data;
              const updatedEmployeesData = [];

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

              return updatedEmployeesData;
          }
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);

const fetchUserDetails = async (userId, headers) => {
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

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload;
    },
    addEmployee(state, action: PayloadAction<Employee>) {
      state.employees.push(action.payload);
    },
    removeEmployee(state, action: PayloadAction<string>) {
      state.employees = state.employees.filter(
        (employee) => employee.id !== action.payload
      );
    },
    // Add other employee-related actions here
    
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.employees = action.payload;
    });
  }
});

export const {
  setEmployees,
  addEmployee,
  removeEmployee,
} = employeesSlice.actions;

export default employeesSlice.reducer;
