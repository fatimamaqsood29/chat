import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reels: [
    { id: 1, title: 'Trending Reel 1', url: 'video1.mp4' },
    { id: 2, title: 'Trending Reel 2', url: 'video2.mp4' },
  ],
  loading: false,
  error: null,
};

const reelsSlice = createSlice({
  name: 'reels',
  initialState,
  reducers: {
    setReels(state, action) {
      state.reels = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setReels, setLoading, setError } = reelsSlice.actions;
export default reelsSlice.reducer;