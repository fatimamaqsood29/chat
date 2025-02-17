import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { FaPaperPlane } from 'react-icons/fa';

export default function MessageInput({ handleSendMessage, darkMode }) {
  const [messageInput, setMessageInput] = useState('');

  return (
    <Box p={2} borderTop={`1px solid ${darkMode ? '#363636' : '#dbdbdb'}`}>
      <TextField
        fullWidth
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(messageInput, setMessageInput)}
        placeholder="Message..."
        InputProps={{
          endAdornment: (
            <IconButton 
              onClick={() => handleSendMessage(messageInput, setMessageInput)} 
              disabled={!messageInput.trim()}
            >
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
  );
}