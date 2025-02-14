import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useThemeContext } from '../ThemeContext';
import { useSelector } from 'react-redux';

export default function Chat() {
  const { darkMode } = useThemeContext();

  const followers = useSelector((state) => state.follow.followers);
  const following = useSelector((state) => state.follow.following);

  const chatUsers = followers.filter((follower) =>
    following.some((user) => user.id === follower.id)
  );

  const [selectedChatUser, setSelectedChatUser] = useState(
    chatUsers.length > 0 ? chatUsers[0] : null
  );

  useEffect(() => {
    if (!selectedChatUser && chatUsers.length > 0) {
      setSelectedChatUser(chatUsers[0]);
    }
  }, [chatUsers, selectedChatUser]);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  useEffect(() => {
    setMessages([]);
  }, [selectedChatUser]);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === 'me' &&
      selectedChatUser
    ) {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: `Hello from ${selectedChatUser.username}!`,
            sender: 'them',
          },
        ]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, selectedChatUser]);

  const sendMessage = () => {
    if (message.trim() && selectedChatUser) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: message, sender: 'me' },
      ]);
      setMessage('');
      toast.success('Message sent!');
    }
  };

  const filteredChatUsers = chatUsers.filter((user) =>
    user.username.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  return (
    <Box minHeight="100vh" display="flex" bgcolor={darkMode ? 'background.default' : 'background.paper'}>
      <Box
        width={{ xs: '100%', sm: 300 }}
        borderRight={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}
        display={{ xs: 'none', sm: 'block' }}
      >
        <Box px={2} py={1} borderBottom={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}>
          <TextField
            fullWidth
            value={chatSearchQuery}
            onChange={(e) => setChatSearchQuery(e.target.value)}
            variant="outlined"
            placeholder="Search mutual friends..."
            size="small"
            sx={{
              backgroundColor: darkMode ? '#424242' : '#FFFFFF',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                height: '40px',
                paddingRight: '8px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: darkMode ? '#FFFFFF80' : '#00000080', marginRight: '8px' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 60px)' }}>
          {filteredChatUsers.map((user) => (
            <ListItem
              key={user.id}
              button
              onClick={() => setSelectedChatUser(user)}
              selected={selectedChatUser && selectedChatUser.id === user.id}
            >
              <ListItemAvatar>
                <Avatar src={user.img || 'https://via.placeholder.com/150'} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" flex="1">
        <Box display="flex" alignItems="center" px={2} py={1.5} borderBottom={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}>
          {selectedChatUser ? (
            <>
              <Avatar
                src={selectedChatUser.img || 'https://via.placeholder.com/150'}
                sx={{ width: 40, height: 40, mr: 2, border: `2px solid ${darkMode ? '#757575' : '#e0e0e0'}` }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#fff' : '#000' }}>
                {selectedChatUser.username}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#000' }}>
              No mutual friend selected
            </Typography>
          )}
        </Box>

        <Box
          flex="1"
          p={2}
          sx={{
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: darkMode ? '#424242' : '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { background: darkMode ? '#757575' : '#888', borderRadius: '4px' },
          }}
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: '70%',
                margin: msg.sender === 'me' ? '0 auto 16px 0' : '0 0 16px auto',
                padding: '12px 16px',
                borderRadius: msg.sender === 'me' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                backgroundColor: msg.sender === 'me' ? '#1976d2' : darkMode ? '#424242' : '#eeeeee',
                color: msg.sender === 'me' ? '#fff' : darkMode ? '#fff' : '#000',
                fontSize: '0.875rem',
                lineHeight: 1.4,
              }}
            >
              {msg.text}
            </motion.div>
          ))}
        </Box>

        <Box px={2} py={2} borderTop={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            variant="outlined"
            placeholder="Type a message..."
            sx={{ backgroundColor: darkMode ? '#424242' : '#FFFFFF', borderRadius: '30px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={sendMessage} sx={{ color: darkMode ? '#fff' : '#1976d2' }}>
                    <FaPaperPlane />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
