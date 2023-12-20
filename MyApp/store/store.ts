import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import employeesReducer from '../redux/reducers/employeesSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        employees: employeesReducer,
    },
})