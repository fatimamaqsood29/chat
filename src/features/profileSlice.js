// features/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: {
    name: localStorage.getItem('profile_name') || '',
    bio: localStorage.getItem('profile_bio') || '',
    profileImage: localStorage.getItem('profile_image') || '/default-avatar.png',
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
      // Update localStorage
      localStorage.setItem('profile_name', action.payload.name);
      localStorage.setItem('profile_bio', action.payload.bio);
      localStorage.setItem('profile_image', action.payload.profileImage || '/default-avatar.png');
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
      // Clear localStorage
      localStorage.removeItem('profile_name');
      localStorage.removeItem('profile_bio');
      localStorage.removeItem('profile_image');
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