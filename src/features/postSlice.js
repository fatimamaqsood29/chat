import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create Post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create post");
      return {
        postId: data.post_id,
        imageUrl: data.image_url,
        caption: formData.get("caption"),
        user: data.user,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch posts");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to like post");
      return { postId, likes_count: data.likes_count, isLiked: data.is_liked };
    } catch (error) {
      return rejectWithValue(error.message);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment_text: commentText }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add comment");
      return { postId, comment: data.comment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Reply
export const addReply = createAsyncThunk(
  "posts/addReply",
  async ({ postId, commentId, replyText }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts/${postId}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reply_text: replyText }),
        }
      );
      console.log(`/api/posts/posts/${postId}/comments/${commentId}/replies`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add reply");
      return { postId, commentId, reply: data.reply };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Reply
export const updateReply = createAsyncThunk(
  "posts/updateReply",
  async ({ postId, commentId, replyId, replyText }, { rejectWithValue }) => {
    debugger
    try {
    
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token is missing.");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts/${postId}/comments/${commentId}/replies/${replyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reply_text: replyText }),
        }
        
      );
      console.error("Server Error:", error.response?.data);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update reply");
      return { postId, commentId, replyId, reply: data.reply };
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
    // Optional optimistic toggle (if needed)
    toggleLikeOptimistic: (state, action) => {
      const post = state.posts.find(p => p._id === action.payload.postId);
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
        state.posts.unshift({
          _id: action.payload.postId,
          image_url: action.payload.imageUrl,
          caption: action.payload.caption,
          user: action.payload.user,
          isLiked: false,
          likes_count: 0,
          comments: [],
        });
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
        state.posts = action.payload.map(post => ({
          ...post,
          likes_count: post.likes_count || (post.likes ? post.likes.length : 0),
          comments: post.comments || [],
        }));
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Post
      .addCase(likePost.pending, (state, action) => {
        const post = state.posts.find(p => p._id === action.meta.arg);
        if (post) {
          // Optimistic update: toggle like
          post.isLiked = !post.isLiked;
          post.likes_count = post.isLiked ? post.likes_count + 1 : post.likes_count - 1;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.likes_count = action.payload.likes_count;
          post.isLiked = action.payload.isLiked;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        const post = state.posts.find(p => p._id === action.meta.arg);
        if (post) {
          // Revert optimistic update
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
        const post = state.posts.find(p => p._id === action.payload.postId);
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
        const post = state.posts.find(p => p._id === postId);
        if (post) {
          const comment = post.comments.find(c => c._id === commentId);
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
        const post = state.posts.find(p => p._id === postId);
        if (post) {
          const comment = post.comments.find(c => c._id === commentId);
          if (comment && comment.replies) {
            const index = comment.replies.findIndex(r => r._id === replyId);
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
