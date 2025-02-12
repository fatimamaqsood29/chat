import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem("access_token") || null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // Expecting payload: { access_token, user }
      const { access_token, user } = action.payload;
      state.token = access_token;
      state.user = user;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;