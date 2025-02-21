// features/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: {
    name: '',
    bio: '',
    profileImage: '/default-avatar.png',
  },
  followers: [],
  following: [],
  posts: [],
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setFollowers: (state, action) => {
      state.followers = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetProfile: (state) => {
      state.profileData = initialState.profileData;
      state.followers = [];
      state.following = [];
      state.posts = [];
    },
  },
});

export const {
  setProfileData,
  setFollowers,
  setFollowing,
  setPosts,
  setLoading,
  setError,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;