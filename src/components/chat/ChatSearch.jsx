import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '../../ThemeContext';

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

function ChatSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const { darkMode } = useThemeContext();
  
  return (
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
  )
}

export default ChatSearch
