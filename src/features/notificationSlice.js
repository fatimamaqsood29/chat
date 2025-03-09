import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async () => {
    const response = await axios.get('/api/notifications');
    return response.data.notifications || []; // Ensure this is an array
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [], // Ensure initial state is an array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload; // Ensure payload is an array
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default notificationSlice.reducer;