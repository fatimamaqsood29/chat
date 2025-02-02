import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Box, TextField, IconButton, Avatar, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useThemeContext } from '../ThemeContext';

export default function Chat() {
  const { userId } = useParams();
  const { darkMode } = useThemeContext();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const chatUser = {
    id: userId,
    name: userId === '1' ? 'Alice' : 'Bob',
    avatar: 'https://via.placeholder.com/150',
  };

  useEffect(() => {
    if (chatUser) {
      const timer = setTimeout(() => {
        setMessages([...messages, { 
          id: messages.length + 1, 
          text: `Hello from ${chatUser.name}!`, 
          sender: 'them' 
        }]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, chatUser]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { 
        id: messages.length + 1, 
        text: message, 
        sender: 'me' 
      }]);
      setMessage('');
      toast.success('Message sent!');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      bgcolor={darkMode ? 'background.default' : 'background.paper'}
    >
      {/* Search Bar */}
      <Box
        px={2}
        py={1}
        borderBottom={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}
      >
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          variant="outlined"
          placeholder="Search messages..."
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
                <SearchIcon 
                  sx={{ 
                    color: darkMode ? '#FFFFFF80' : '#00000080', 
                    marginRight: '8px' 
                  }} 
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Chat Header */}
      <Box
        display="flex"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}
      >
        <Avatar 
          src={chatUser.avatar} 
          sx={{ 
            width: 40, 
            height: 40, 
            mr: 2,
            border: `2px solid ${darkMode ? '#757575' : '#e0e0e0'}`
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: darkMode ? '#fff' : '#000'
          }}
        >
          {chatUser.name}
        </Typography>
      </Box>

      {/* Chat Messages Section */}
      <Box
        flex="1"
        p={2}
        sx={{
          maxHeight: 'calc(100vh - 160px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: darkMode ? '#424242' : '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: darkMode ? '#757575' : '#888',
            borderRadius: '4px',
          },
        }}
      >
        {filteredMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: '70%',
              margin: msg.sender === 'me' ? '0 auto 16px 0' : '0 0 16px auto',
              padding: '12px 16px',
              borderRadius: msg.sender === 'me' 
                ? '20px 20px 0 20px' 
                : '20px 20px 20px 0',
              backgroundColor: msg.sender === 'me' 
                ? (darkMode ? '#1976d2' : '#1976d2') 
                : (darkMode ? '#424242' : '#eeeeee'),
              color: msg.sender === 'me' ? '#fff' : (darkMode ? '#fff' : '#000'),
              fontSize: '0.875rem',
              lineHeight: 1.4,
            }}
          >
            {msg.text}
          </motion.div>
        ))}
      </Box>

      {/* Message Input */}
      <Box
        px={2}
        py={2}
        borderTop={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}
      >
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          variant="outlined"
          placeholder="Type a message..."
          sx={{
            backgroundColor: darkMode ? '#424242' : '#FFFFFF',
            borderRadius: '30px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '30px',
              paddingRight: '8px',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={sendMessage}
                  sx={{
                    color: darkMode ? '#fff' : '#1976d2',
                    '&:hover': {
                      backgroundColor: darkMode ? '#ffffff1a' : '#1976d20a',
                    },
                  }}
                >
                  <FaPaperPlane />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}