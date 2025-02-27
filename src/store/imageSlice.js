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
  },
});

export default imageSlice.reducer;
