import { configureStore } from '@reduxjs/toolkit';
import followReducer from '../features/followSlice';
import postReducer from '../features/postSlice';
import imageReducer from './imageSlice';

export default configureStore({
  reducer: {
    follow: followReducer,
    post: postReducer,
    images: imageReducer,
  },
});
