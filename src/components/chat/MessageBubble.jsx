import { Box, Typography, Avatar } from '@mui/material';

export default function MessageBubble({ msg, currentUser, darkMode }) {
  return (
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
          color: msg.sender_id === currentUser._id ? '#fff' : darkMode ? '#fff' : '#000',
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
  );
}