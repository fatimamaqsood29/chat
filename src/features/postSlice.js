import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for creating a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("access_token"); // Ensure the key matches storage
      console.log("Token from localStorage:", token); // Debugging

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts`,
        {
          method: "POST",
          //credentials: "include",
          withCredentials: "true",
          body: formData, // FormData will automatically set Content-Type
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      console.log("Post created successfully with ID:", data.post_id); // Log postId

      return {
        postId: data.post_id,
        imageUrl: data.image_url,
        caption: formData.get("caption"), // Include caption from formData
        notification: data.notification, // Include notification data
      };
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
      const post = state.posts.find((p) => p.postId === action.payload);
      if (post) {
        post.liked = !post.liked;
      }
    },
    addCommentToPost: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.postId === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    toggleCommentInput: (state, action) => {
      const post = state.posts.find((p) => p.postId === action.payload);
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
        // Add the new post to the beginning of the posts array
        state.posts.unshift({
          postId: action.payload.postId,
          imageUrl: action.payload.imageUrl,
          caption: action.payload.caption,
          liked: false,
          comments: [],
          showCommentInput: false,
        });
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Post creation error:", action.payload);
      });
  },
});

export const { toggleLikePost, addCommentToPost, toggleCommentInput } =
  postSlice.actions;
export default postSlice.reducer;
