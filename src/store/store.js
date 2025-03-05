import { configureStore } from '@reduxjs/toolkit';
import followReducer from '../features/followSlice';
import postReducer from '../features/postSlice';
import imageReducer from './imageSlice';
import authReducer from '../features/authSlice'; // import auth slice
import chatReducer from '../features/chatSlice';
import storyReducer from '../features/storySlice';
export default configureStore({
  reducer: {
    follow: followReducer,
    post: postReducer,
    images: imageReducer,
    auth: authReducer, // add auth reducer
    chat: chatReducer,
    story:storyReducer,

  },
});
