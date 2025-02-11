import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  images: [],
  loading: false,
  error: null,
};

export const fetchTrendingImages = createAsyncThunk(
  'images/fetchTrendingImages',
  async () => {
    // Replace mock data with API call
    const mockImages = [
      { id: 1, title: 'Trending Image 1', url: 'image1.jpg', likes: 120, comments: 30 },
      { id: 2, title: 'Trending Image 2', url: 'image2.jpg', likes: 200, comments: 50 },
    ];
    return mockImages;
  }
);

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchTrendingImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default imageSlice.reducer;
