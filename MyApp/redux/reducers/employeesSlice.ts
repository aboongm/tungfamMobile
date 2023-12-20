import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

export const {
  setEmployees,
  addEmployee,
  removeEmployee,
  // Export other actions if needed
} = employeesSlice.actions;

export default employeesSlice.reducer;
