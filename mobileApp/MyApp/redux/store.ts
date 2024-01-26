import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import employeesSlice from './slices/employees/employeesSlice'
import HeaderSlice from "./slices/HeaderSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        headerSlice: HeaderSlice,
        employees: employeesSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch