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
      const { access_token, user } = action.payload;
      state.token = access_token;
      state.user = user;

      // Store in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user_id", user.id); // Store user ID separately
      console.log("Login Success - Token and User ID stored in loc",{
        user,
        access_token,
        user_id : user.id,
      });

    },
    
    logout: (state) => {
      state.token = null;
      state.user = null;

      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id"); // Clear user ID
      console.log("Logout - LocalStorage cleared");
      
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
