import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useThemeContext } from '../ThemeContext';
import { toast } from 'react-hot-toast';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  fetchChatrooms,
  fetchMessages,
  sendMessage,
  setCurrentChatroom,
  addOptimisticMessage,
  removeFailedMessage,
} from '../features/chatSlice';
import ChatSearch from '../components/chat/ChatSearch';
import ChatList from '../components/chat/ChatList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import MessageInput from '../components/chat/MessageInput';

export default function Chat() {
  const dispatch = useDispatch();
  const { darkMode } = useThemeContext();
  const { chatrooms, currentChatroomId, messages, loading } = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch chatrooms when component mounts
  useEffect(() => {
    dispatch(fetchChatrooms());
  }, [dispatch]);

  // Auto-scroll to the bottom when messages or current chatroom changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChatroomId]);

  const handleSelectChatroom = (chatroomId) => {
    dispatch(setCurrentChatroom(chatroomId));
    dispatch(fetchMessages(chatroomId));
  };

  const handleSendMessage = async (content, setMessageInput) => {
    if (!content.trim() || !currentChatroomId) return;

    // Create a temporary ID and optimistic message
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      sender_id: currentUser._id,
      message: content,
      timestamp: new Date().toISOString(),
      sender_name: currentUser.name,
      sender_profile: currentUser.profile_picture,
      isTemp: true,
    };

    // Optimistically add the message
    dispatch(addOptimisticMessage({
      chatroomId: currentChatroomId,
      message: tempMessage,
    }));

    // Clear the input field
    setMessageInput('');

    try {
      await dispatch(sendMessage({
        chatroomId: currentChatroomId,
        message: content,
        tempId,
      })).unwrap();
    } catch (error) {
      // Remove the optimistic message if sending fails
      dispatch(removeFailedMessage({
        chatroomId: currentChatroomId,
        messageId: tempId,
      }));
      toast.error('Failed to send message');
    }
  };

  // Find the current chatroom and the recipient
  const currentChatroom = chatrooms.find((c) => c._id === currentChatroomId);
  const recipient = currentChatroom?.participants.find((p) => p._id !== currentUser._id);

  // Filter chatrooms based on search query
  const filteredChatrooms = chatrooms.filter((chatroom) => {
    const user = chatroom.participants.find((p) => p._id !== currentUser._id);
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box minHeight="100vh" display="flex" bgcolor={darkMode ? 'background.default' : 'background.paper'}>
      {/* Chat List Sidebar */}
      <Box width={{ xs: '100%', sm: 350 }} borderRight={`1px solid ${darkMode ? '#363636' : '#dbdbdb'}`}>
        <Box p={2} borderBottom={`1px solid ${darkMode ? '#363636' : '#dbdbdb'}`}>
          <ChatSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            darkMode={darkMode} 
          />
        </Box>
        <ChatList
          filteredChatrooms={filteredChatrooms}
          currentUser={currentUser}
          currentChatroomId={currentChatroomId}
          handleSelectChatroom={handleSelectChatroom}
          darkMode={darkMode}
        />
      </Box>

      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column">
        {currentChatroom ? (
          <>
            {/* Chat Header: Displays the recipient's info */}
            <ChatHeader headerUser={recipient} darkMode={darkMode} />

            {/* Chat Messages */}
            <ChatMessages
              messages={messages}
              currentUser={currentUser}
              darkMode={darkMode}
              loading={loading}
              messagesEndRef={messagesEndRef}
              currentChatroomId={currentChatroomId}
            />

            {/* Message Input */}
            <MessageInput 
              handleSendMessage={handleSendMessage} 
              darkMode={darkMode} 
            />
          </>
        ) : (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center">
            <Typography color={darkMode ? '#a8a8a8' : '#737373'}>
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}