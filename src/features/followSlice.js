import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to follow a user
export const followUser = createAsyncThunk(
  'follow/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE_URL}/api/users/follow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // You can log or use response.data (for example, for notifications)
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to unfollow a user
export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.delete(`${API_BASE_URL}/api/users/unfollow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  followers: [],
  following: [],
  // Dummy suggestions; in a real app these could be fetched from an API
  suggestions: [
    { id: 1, username: 'nature_lover', img: 'https://via.placeholder.com/50' },
    { id: 2, username: 'tech_guru', img: 'https://via.placeholder.com/50' },
    { id: 3, username: 'fitness_freak', img: 'https://via.placeholder.com/50' },
    { id: 4, username: 'travel_junkie', img: 'https://via.placeholder.com/50' },
    { id: 5, username: 'foodie_diaries', img: 'https://via.placeholder.com/50' },
  ],
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    addFollower: (state, action) => {
      state.followers.push(action.payload);
    },
    addFollowing: (state, action) => {
      state.following.push(action.payload);
    },
    removeFollower: (state, action) => {
      state.followers = state.followers.filter(user => user.id !== action.payload);
    },
    removeFollowing: (state, action) => {
      state.following = state.following.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        // Avoid duplicates before adding the user to the following list
        if (!state.following.some(user => user.id === userId)) {
          // Here we simply store the id – you could store additional user data if available
          state.following.push({ id: userId });
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.following = state.following.filter(user => user.id !== userId);
      });
  },
});

export const { addFollower, addFollowing, removeFollower, removeFollowing } = followSlice.actions;
export default followSlice.reducer;