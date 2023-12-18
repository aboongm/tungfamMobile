import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
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


interface AuthState {
    token: string | null;
    userData: User | {};
    didTryAutoLogin: boolean;
}

const initialState: AuthState = {
    token: null,
    userData: {},
    didTryAutoLogin: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authenticate: (state, action: PayloadAction<{ token: string; userData: User; expirationTime: number }>) => {
            const { payload } = action;
            state.token = payload.token;
            state.userData = payload.userData;
        },
        setDidTryAutoLogin: (state) => {
            state.didTryAutoLogin = true;
        },
        logOut: (state) => {
            state.token = null;
            state.userData = {};
            state.didTryAutoLogin = false;
        },
        updateLoggedInSignInUserData: (state, action: PayloadAction<{newData: Partial<User>}>) => {
            state.userData = { ...state.userData, ...action.payload.newData };
        },
        setUserData: (state, action: PayloadAction<User>) => {
            state.userData = action.payload;
        },
        updateUserRole: (state, action: PayloadAction<User>) => {
            state.userData = action.payload;
        },
    },
});

export const {
    authenticate,
    setDidTryAutoLogin,
    logOut,
    updateLoggedInSignInUserData,
    setUserData,
    updateUserRole
} = authSlice.actions;

export default authSlice.reducer;
