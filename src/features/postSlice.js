import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create Post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create post");
    }
  }
);

// Fetch Random Posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await axios.get(
        `${API_BASE_URL}/api/posts/posts/random`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch posts");
    }
  }
);

// Like Post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to like post");
    }
  }
);

// Add Comment
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, commentText }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/posts/${postId}/comment`,
        { comment_text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add comment");
    }
  }
);

// export const addReply = createAsyncThunk(
//   "posts/addReply",
//   async ({ postId, commentId, replyText }, { rejectWithValue }) => {
//     try {
//       console.log("Post ID:", postId); // Debugging
//       console.log("Comment ID:", commentId); // Debugging
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("Authentication token is missing.");
//       const response = await axios.post(
//         `${API_BASE_URL}/api/posts/posts/${postId}/comments/${commentId}/reply`,
//         { reply_text: replyText },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to add reply");
//     }
//   }
// );
export const addReply = createAsyncThunk(
  "posts/addReply",
  async ({ postId, commentId, replyText }, { rejectWithValue }) => {
    try {
      console.log("Post ID:", postId); // Debugging
      console.log("Comment ID:", commentId); // Debugging

      if (!commentId) throw new Error("Comment ID is missing.");

      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");

      const response = await axios.post(
        `${API_BASE_URL}/api/posts/posts/${postId}/comments/${commentId}/reply`,
        { reply_text: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add reply");
    }
  }
);

// Update Reply
export const updateReply = createAsyncThunk(
  "posts/updateReply",
  async ({ postId, commentId, replyId, replyText }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await axios.put(
        `${API_BASE_URL}/api/posts/posts/${postId}/comments/${commentId}/replies/${replyId}`,
        { reply_text: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update reply");
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
    // Optional optimistic toggle (if needed)
    toggleLikeOptimistic: (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes_count = post.isLiked ? post.likes_count + 1 : post.likes_count - 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Post
      .addCase(likePost.pending, (state, action) => {
        const post = state.posts.find((p) => p._id === action.meta.arg);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likes_count = post.isLiked ? post.likes_count + 1 : post.likes_count - 1;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.likes_count = action.payload.likes_count;
          post.isLiked = action.payload.isLiked;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        const post = state.posts.find((p) => p._id === action.meta.arg);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likes_count = post.isLiked ? post.likes_count + 1 : post.likes_count - 1;
        }
        state.error = action.payload;
      })
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.comments.unshift(action.payload.comment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Reply
      .addCase(addReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReply.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, commentId, reply } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          const comment = post.comments.find((c) => c._id === commentId);
          if (comment) {
            if (!comment.replies) comment.replies = [];
            comment.replies.push(reply);
          }
        }
      })
      .addCase(addReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Reply
      .addCase(updateReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReply.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, commentId, replyId, reply } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          const comment = post.comments.find((c) => c._id === commentId);
          if (comment && comment.replies) {
            const index = comment.replies.findIndex((r) => r._id === replyId);
            if (index !== -1) {
              comment.replies[index] = reply;
            }
          }
        }
      })
      .addCase(updateReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleLikeOptimistic } = postSlice.actions;
export default postSlice.reducer;