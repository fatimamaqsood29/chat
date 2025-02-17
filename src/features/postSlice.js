import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for creating a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      // Simulate API call (Replace with actual API request)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleLikePost: (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload);
      if (post) {
        post.liked = !post.liked;
      }
    },
    addCommentToPost: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    toggleCommentInput: (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload);
      if (post) {
        post.showCommentInput = !post.showCommentInput;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleLikePost, addCommentToPost, toggleCommentInput } = postSlice.actions;
export default postSlice.reducer;
