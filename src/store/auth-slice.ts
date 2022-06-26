import { createSlice } from "@reduxjs/toolkit";

interface IUser {
  id: string;
  email: string;
  verified: boolean;
}
interface IAuthState {
  isLoggedIn: boolean;
  user: null | IUser;
}

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, user: null } as IAuthState,
  reducers: {
    signin(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    signout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
