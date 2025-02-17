import { Box, Avatar, Typography } from '@mui/material';

export default function ChatHeader({ headerUser, darkMode }) {
  return (
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
  );
}