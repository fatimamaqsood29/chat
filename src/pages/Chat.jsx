import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  createChatroom,
} from '../features/chatSlice';
import { followUser, unfollowUser, fetchSuggestions } from '../features/followSlice'; // Import followSlice actions
import ChatSearch from '../components/chat/ChatSearch';
import ChatList from '../components/chat/ChatList';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import MessageInput from '../components/chat/MessageInput';

export default function Chat() {
  const dispatch = useDispatch();
  const { darkMode } = useThemeContext();
  const { chatrooms, currentChatroomId, messages, loading } = useSelector((state) => state.chat);
  const { following } = useSelector((state) => state.follow); // Get following list from followSlice
  const currentUser = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFollowingEachOther, setIsFollowingEachOther] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch chatrooms when component mounts
  useEffect(() => {
    dispatch(fetchChatrooms());
  }, [dispatch]);

  // Auto-scroll to the bottom when messages or current chatroom changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChatroomId]);

  // Check if the current user and recipient follow each other
  useEffect(() => {
    if (currentChatroomId) {
      const currentChatroom = chatrooms.find((c) => c._id === currentChatroomId);
      const recipient = currentChatroom?.participants.find((p) => p._id !== currentUser.id);

      console.log('Current Chatroom:', currentChatroom);
      console.log('Recipient:', recipient);

      if (recipient) {
        // Check if the current user follows the recipient
        const isFollowingRecipient = following.some((user) => user.id === recipient._id);

        // Check if the recipient follows the current user
        const isRecipientFollowingCurrentUser = recipient.followers?.includes(currentUser.id);

        // Update follow status
        setIsFollowingEachOther(true);
      }
    }
  }, [currentChatroomId, chatrooms, currentUser.id, following]);

  // Handle selecting a chatroom with error handling for fetchMessages
  const handleSelectChatroom = async (chatroomId) => {
    try {
      dispatch(setCurrentChatroom(chatroomId));
      await dispatch(fetchMessages(chatroomId)).unwrap();
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  // Handle creating a new chatroom
  const handleCreateChatroom = async (participantId) => {
    try {
      const result = await dispatch(createChatroom(participantId)).unwrap();
      if (result.chatroom_id) {
        toast.success('Chatroom created successfully');
        dispatch(setCurrentChatroom(result.chatroom_id));
      } else {
        toast.error(result.message || 'Failed to create chatroom');
      }
    } catch (error) {
      toast.error('Failed to create chatroom');
    }
  };

  // Handle sending a message with optimistic UI updates
  const handleSendMessage = async (content, setMessageInput) => {
    if (!content.trim() || !currentChatroomId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      sender_id: currentUser.id,
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

    setMessageInput('');

    try {
      await dispatch(sendMessage({
        chatroomId: currentChatroomId,
        message: content,
        tempId,
      })).unwrap();
    } catch (error) {
      dispatch(removeFailedMessage({
        chatroomId: currentChatroomId,
        messageId: tempId,
      }));
      toast.error('Failed to send message');
    }
  };

  // Find the current chatroom and recipient
  const currentChatroom = chatrooms.find((c) => c._id === currentChatroomId);
  const recipient = currentChatroom?.participants.find((p) => p._id !== currentUser.id);

  // Memoized filtering of chatrooms to optimize performance
  const filteredChatrooms = useMemo(() => {
    return chatrooms.filter((chatroom) => {
      const user = chatroom.participants.find((p) => p._id !== currentUser.id);
      return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chatrooms, searchQuery, currentUser.id]);

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
          handleCreateChatroom={handleCreateChatroom}
          darkMode={darkMode}
        />
      </Box>

      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column">
        {currentChatroom ? (
          <>
            {/* Always show ChatHeader if currentChatroom exists */}
            {recipient && <ChatHeader headerUser={recipient} darkMode={darkMode} />}

            {isFollowingEachOther ? (
              <>
                <ChatMessages
                  messages={messages}
                  currentUser={currentUser}
                  darkMode={darkMode}
                  loading={loading}
                  messagesEndRef={messagesEndRef}
                  currentChatroomId={currentChatroomId}
                />
                <MessageInput 
                  handleSendMessage={handleSendMessage} 
                  darkMode={darkMode} 
                />
              </>
            ) : (
              <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                <Typography color={darkMode ? '#a8a8a8' : '#737373'}>
                  You cannot chat with this user because you do not follow each other.
                </Typography>
              </Box>
            )}
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