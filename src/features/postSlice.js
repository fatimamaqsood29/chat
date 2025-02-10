import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [
    {
      id: 1,
      username: 'mishi_262',
      image: 'https://via.placeholder.com/300',
      likes: 0,
      liked: false,
      comments: [],
      showCommentInput: false,
    },
    // Add more sample posts if needed
  ],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    toggleLikePost: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.liked = !post.liked;
        post.likes = post.liked ? post.likes + 1 : post.likes - 1;
      }
    },
    toggleCommentInput: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.showCommentInput = !post.showCommentInput;
      }
    },
    addCommentToPost: (state, action) => {
      const { postId, commentText } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.comments.push(commentText);
      }
    },
  },
});

export const { toggleLikePost, toggleCommentInput, addCommentToPost } = postSlice.actions;
export default postSlice.reducer;