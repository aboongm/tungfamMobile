import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
    //   console.log("state", state);
    },
    setDidTryAutoLogin: (state, action) => {
      state.didTryAutoLogin = true
    },
    logOut: (state, action) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },
    updateLoggedInSignInUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.newData}
    },
  },
});

export const authenticate = authSlice.actions.authenticate;
export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export const logOut = authSlice.actions.logOut;
export const updateLoggedInSignInUserData = authSlice.actions.updateLoggedInSignInUserData;
export const setUserData = authSlice.actions.setUserData;
export default authSlice.reducer;
