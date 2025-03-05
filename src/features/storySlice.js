import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadStory = createAsyncThunk(
  'stories/upload',
  async (file, { getState }) => {
    const token = getState().auth.token;
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/posts/stories_upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
);

export const fetchFollowingStories = createAsyncThunk(
  'stories/fetchFollowing',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(
      `${API_BASE_URL}/api/posts/stories`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const deleteStory = createAsyncThunk(
  'stories/delete',
  async (storyId, { getState }) => {
    const token = getState().auth.token;
    await axios.delete(
      `${API_BASE_URL}/api/posts/stories/${storyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return storyId;
  }
);

const storySlice = createSlice({
  name: 'story',
  initialState: {
    stories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowingStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowingStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchFollowingStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadStory.fulfilled, (state, action) => {
        state.stories.unshift(action.payload);
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.stories = state.stories.filter(story => story._id !== action.payload);
      });
  },
});

export default storySlice.reducer;