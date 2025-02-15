import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch chatrooms
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
      console.error('fetchChatrooms error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch messages for a specific chatroom
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
      console.error('fetchMessages error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Send a message (including both "message" and "chatroom_id" in the payload)
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatroomId, message, tempId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/message/${chatroomId}`,
        { message, chatroom_id: chatroomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Merge the API response with our temporary ID so we can replace the optimistic message
      return { ...response.data.data, tempId };
    } catch (error) {
      console.error('sendMessage error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
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
      state.messages[chatroomId].push(message);
    },
    removeFailedMessage: (state, action) => {
      const { chatroomId, messageId } = action.payload;
      state.messages[chatroomId] = state.messages[chatroomId].filter(
        (msg) => msg._id !== messageId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatrooms.fulfilled, (state, action) => {
        state.chatrooms = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatroomId, messages } = action.payload;
        state.messages[chatroomId] = messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatroom_id, tempId, ...sentMessage } = action.payload;
        const messagesArray = state.messages[chatroom_id] || [];
        const index = messagesArray.findIndex((msg) => msg._id === tempId);
        if (index !== -1) {
          messagesArray[index] = sentMessage;
        } else {
          messagesArray.push(sentMessage);
        }
        state.messages[chatroom_id] = messagesArray;
      });
  },
});

export const { setCurrentChatroom, addOptimisticMessage, removeFailedMessage } = chatSlice.actions;
export default chatSlice.reducer;
