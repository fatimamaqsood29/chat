import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchChatrooms = createAsyncThunk(
  'chat/fetchChatrooms',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE_URL}/api/chat/chatrooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatroomId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE_URL}/api/chat/messages/${chatroomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { chatroomId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatroomId, message }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/message/${chatroomId}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchMessages(chatroomId)); // Refresh messages after sending
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  chatrooms: [],
  currentChatroomId: null,
  messages: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChatroom: (state, action) => {
      state.currentChatroomId = action.payload;
    },
    addOptimisticMessage: (state, action) => {
      const { chatroomId, message } = action.payload;
      if (!state.messages[chatroomId]) state.messages[chatroomId] = [];
      state.messages[chatroomId].unshift(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatrooms.fulfilled, (state, action) => {
        state.chatrooms = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatroomId, messages } = action.payload;
        state.messages[chatroomId] = messages.reverse();
      });
  },
});

export const { setCurrentChatroom, addOptimisticMessage } = chatSlice.actions;
export default chatSlice.reducer;