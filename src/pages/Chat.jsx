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
        setMessages([...messages, { id: messages.length + 1, text: `Hello from ${chatUser.name}!`, sender: 'them' }]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, chatUser]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, sender: 'me' }]);
      setMessage('');
      toast.success('Message sent!');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    // Implement search functionality here
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      bgcolor={darkMode ? 'background.default' : 'background.paper'}
    >
      {/* Search Bar */}
      <Box
        p={2}
        borderBottom={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          variant="outlined"
          placeholder="Search messages..."
          sx={{
            backgroundColor: darkMode ? '#424242' : '#FFFFFF',
            color: darkMode ? '#FFFFFF' : '#000',
            borderRadius: '20px', // Rounded corners
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px', // Rounded corners for the input
              height: '48px', // Increase text field size
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: darkMode ? '#FFF' : '#000' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={sendMessage}
                  sx={{
                    color: darkMode ? '#FFF' : '#007BFF',
                    '&:hover': {
                      backgroundColor: 'transparent', // Remove hover background
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

      {/* Chat Header */}
      <Box display="flex" alignItems="center" p={2} borderBottom={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}>
        <Avatar src={chatUser.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
        <Typography variant="h6" color={darkMode ? 'grey.100' : 'text.primary'}>
          {chatUser.name}
        </Typography>
      </Box>

      {/* Chat Messages Section */}
      <Box
        flex="1"
        p={4}
        overflow="auto"
        sx={{
          maxHeight: 'calc(100vh - 200px)', // Adjust height for responsiveness
          overflowY: 'auto',
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
              margin: msg.sender === 'me' ? '0 auto 10px 0' : '0 0 10px auto',
              padding: '10px 15px',
              borderRadius: '8px',
              backgroundColor: msg.sender === 'me' ? '#007BFF' : darkMode ? '#424242' : '#E0E0E0',
              color: msg.sender === 'me' ? '#FFF' : darkMode ? '#FFF' : '#000',
              textAlign: 'left',
            }}
          >
            {msg.text}
          </motion.div>
        ))}
      </Box>

      {/* Message Input Section */}
      <Box
        p={2}
        borderTop={`1px solid ${darkMode ? '#424242' : '#E0E0E0'}`}
        bgcolor={darkMode ? 'background.default' : 'background.paper'}
      >
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            placeholder="Type a message..."
            sx={{
              backgroundColor: darkMode ? '#424242' : '#FFFFFF',
              color: darkMode ? '#FFFFFF' : '#000',
              borderRadius: '30px', // Rounded corners
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px', // Rounded corners for the input
                height: '40px', // Increase text field size
              },
            }}
          />
          <IconButton
            onClick={sendMessage}
            sx={{
              color: darkMode ? '#FFF' : '#007BFF',
              ml: 1,
              backgroundColor: darkMode ? '#424242' : '#E0E0E0',
              borderRadius: '50%',
              padding: '10px',
              '&:hover': {
                backgroundColor: darkMode ? '#616161' : '#BDBDBD',
              },
            }}
          >
            <FaPaperPlane />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}