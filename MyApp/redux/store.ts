import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import employeesReducer from './slices/employees/employeesSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        employees: employeesReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch