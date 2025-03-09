import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  images: [],
  loading: false,
  error: null,
};

export const fetchTrendingImages = createAsyncThunk(
  'images/fetchTrendingImages',
  async (_, { rejectWithValue }) => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/posts/trending`;
    const token = localStorage.getItem('access_token');

    if (!token) return rejectWithValue("Authentication required");

    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
        state.error = action.payload;
      });
  }
});

export default imageSlice.reducer;