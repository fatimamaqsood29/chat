import { configureStore } from '@reduxjs/toolkit';
import followReducer from '../features/followSlice';
import postReducer from '../features/postSlice';

export default configureStore({
  reducer: {
    follow: followReducer,
    post: postReducer,
  },
});