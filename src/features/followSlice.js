import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to follow a user
export const followUser = createAsyncThunk(
  'follow/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_BASE_URL}/api/users/follow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const response = await axios.delete(
        `${API_BASE_URL}/api/users/unfollow/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch user suggestions
export const fetchSuggestions = createAsyncThunk(
  'follow/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE_URL}/api/users/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  followers: [],
  following: [],
  suggestions: [],
  loading: false,
  error: null,
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
      state.followers = state.followers.filter((user) => user.id !== action.payload);
    },
    removeFollowing: (state, action) => {
      state.following = state.following.filter((user) => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (!state.following.some((user) => user.id === userId)) {
          state.following.push({ id: userId });
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.following = state.following.filter((user) => user.id !== userId);
      })
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addFollower, addFollowing, removeFollower, removeFollowing } = followSlice.actions;
export default followSlice.reducer;