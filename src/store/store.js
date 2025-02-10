import { configureStore } from '@reduxjs/toolkit';
import followReducer from '../features/followSlice';
import postReducer from '../features/postSlice';
import reelsReducer from './reelsSlice';

export default configureStore({
  reducer: {
    follow: followReducer,
    post: postReducer,
    reels: reelsReducer,

  },
});