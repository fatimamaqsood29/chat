import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  images: [], // Holds the fetched images
  loading: false, // Indicates if data is being fetched
  error: null, // Holds any error messages
  hasMore: true, // Indicates if there are more images to fetch (not used in infinite loop but kept for flexibility)
};

export const fetchTrendingImages = createAsyncThunk(
  'images/fetchTrendingImages',
  async (_, { rejectWithValue }) => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/posts/trending`;
    const token = localStorage.getItem('access_token'); // 🔹 Get token from local storage

    if (!token) {
      console.error("No token found in local storage.");
      return rejectWithValue("Authentication token is missing.");
    }

    try {
      console.log("Fetching from:", apiUrl); // ✅ Logs the API URL
      console.log("Using token:", token); // ✅ Logs the token (remove in production)

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // 🔹 Pass token in the header
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data); // ✅ Logs response data
      return data;
    } catch (error) {
      console.error("Fetch error:", error.message); // ✅ Logs error message
      return rejectWithValue(error.message);
    }
  }
);

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    // Optional: Add a reducer to reset the state if needed
    resetImages: (state) => {
      state.images = [];
      state.loading = false;
      state.error = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingImages.fulfilled, (state, action) => {
        state.loading = false;
        // Append new images to the existing array (if needed)
        state.images = action.payload; // Replace the entire array for infinite loop
        state.hasMore = action.payload.length > 0; // Optional: Useful for pagination
      })
      .addCase(fetchTrendingImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetImages } = imageSlice.actions; // Export the reset action if needed
export default imageSlice.reducer;