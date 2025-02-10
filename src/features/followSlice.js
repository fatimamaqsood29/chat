import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  followers: [],
  following: [],
  // Seed dummy suggestions for follow recommendations:
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
});

export const { addFollower, addFollowing, removeFollower, removeFollowing } = followSlice.actions;
export default followSlice.reducer;