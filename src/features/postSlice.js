import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for creating a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      return {
        postId: data.post_id,
        imageUrl: data.image_url,
        caption: formData.get("caption"),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch posts");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for liking a post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to like post");
      }

      return { postId, likes: data.likes };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding a comment
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, commentText }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      return { postId, comment: data.comment };
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
      })
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
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.postId === action.payload.postId);
        if (post) {
          post.likes = action.payload.likes;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.postId === action.payload.postId);
        if (post) {
          post.comments.push(action.payload.comment);
        }
      });
  },
});

export const { toggleLikePost, addCommentToPost, toggleCommentInput } =
  postSlice.actions;
export default postSlice.reducer;