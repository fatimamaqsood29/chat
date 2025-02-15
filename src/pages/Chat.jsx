import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {
  Box,
  TextField,
  IconButton,
  Avatar,
  Typography,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useThemeContext } from '../ThemeContext';
import {
  fetchChatrooms,
  fetchMessages,
  sendMessage,
  setCurrentChatroom,
  addOptimisticMessage,
  removeFailedMessage,
} from '../features/chatSlice';

export default function Chat() {
  const dispatch = useDispatch();
  const { darkMode } = useThemeContext();
  const { chatrooms, currentChatroomId, messages, loading } = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);
  const [messageInput, setMessageInput] = useState('');
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

  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content || !currentChatroomId) return;

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

  const currentChatroom = chatrooms.find((c) => c._id === currentChatroomId);

  // --- Chat Header Fix ---
  // To display the sender's info in the chat header, we always use the current user's details.
  const headerUser = currentUser;

  const filteredChatrooms = chatrooms.filter((chatroom) => {
    // Filter by the conversation partner's name (for the sidebar list)
    const user = chatroom.participants.find((p) => p._id !== currentUser._id);
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box minHeight="100vh" display="flex" bgcolor={darkMode ? 'background.default' : 'background.paper'}>
      {/* Chat List Sidebar */}
      <Box width={{ xs: '100%', sm: 350 }} borderRight={`1px solid ${darkMode ? '#363636' : '#dbdbdb'}`}>
        <Box p={2} borderBottom={`1px solid ${darkMode ? '#363636' : '#dbdbdb'}`}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 20,
                bgcolor: darkMode ? '#262626' : '#fafafa',
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>

        <List sx={{ overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
          {filteredChatrooms.map((chatroom) => {
            const user = chatroom.participants.find((p) => p._id !== currentUser._id);
            return (
              <ListItem
                key={chatroom._id}
                button
                selected={chatroom._id === currentChatroomId}
                onClick={() => handleSelectChatroom(chatroom._id)}
                sx={{
                  '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                  py: 1.5,
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!chatroom.unread_count}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar src={user?.profile_picture} sx={{ width: 56, height: 56 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={user?.name}
                  secondary={chatroom.last_message?.message}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: darkMode ? '#fff' : '#000',
                  }}
                  secondaryTypographyProps={{
                    color: darkMode ? '#a8a8a8' : '#737373',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column">
        {currentChatroom ? (
          <>
            {/* Chat Header: Displays the sender's (current user's) info */}
            <Box
              p={2}
              display="flex"
              alignItems="center"
              borderBottom={`1px solid ${darkMode ? '#363636' : '#dbdbdb'}`}
            >
              <Avatar src={headerUser?.profile_picture} sx={{ width: 40, height: 40, mr: 2 }} />
              <Typography variant="h6" fontWeight={600} color={darkMode ? '#fff' : '#000'}>
                {headerUser?.name || 'Unknown User'}
              </Typography>
            </Box>

            {/* Chat Messages */}
            <Box flex={1} overflow="auto" p={2} bgcolor={darkMode ? 'rgba(0,0,0,0.3)' : '#fafafa'}>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                messages[currentChatroomId]?.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender_id === currentUser._id ? 'flex-end' : 'flex-start',
                      marginBottom: 16,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        maxWidth: '70%',
                        gap: 1,
                        flexDirection: msg.sender_id === currentUser._id ? 'row-reverse' : 'row',
                      }}
                    >
                      {msg.sender_id !== currentUser._id && (
                        <Avatar src={msg.sender_profile} sx={{ width: 32, height: 32 }} />
                      )}
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 18,
                          bgcolor:
                            msg.sender_id === currentUser._id
                              ? darkMode
                                ? '#0095f6'
                                : '#3797f0'
                              : darkMode
                              ? '#262626'
                              : '#ffffff',
                          color:
                            msg.sender_id === currentUser._id ? '#fff' : darkMode ? '#fff' : '#000',
                          border:
                            msg.sender_id !== currentUser._id
                              ? `1px solid ${darkMode ? '#363636' : '#dbdbdb'}`
                              : 'none',
                        }}
                      >
                        <Typography variant="body2">{msg.message}</Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          textAlign="right"
                          color={msg.sender_id === currentUser._id ? '#ffffff80' : '#a8a8a8'}
                          mt={0.5}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box p={2} borderTop={`1px solid ${darkMode ? '#363636' : '#dbdbdb'}`}>
              <TextField
                fullWidth
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message..."
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <FaPaperPlane
                        color={messageInput.trim() ? (darkMode ? '#fff' : '#000') : '#a8a8a8'}
                      />
                    </IconButton>
                  ),
                  sx: {
                    borderRadius: 20,
                    bgcolor: darkMode ? '#262626' : '#fafafa',
                    '& fieldset': { border: 'none' },
                  },
                }}
              />
            </Box>
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
