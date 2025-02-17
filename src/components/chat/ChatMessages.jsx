import { motion } from 'framer-motion';
import { Box, CircularProgress, Typography, Avatar } from '@mui/material';
import MessageBubble from './MessageBubble';

export default function ChatMessages({
  messages,
  currentUser,
  darkMode,
  loading,
  messagesEndRef,
  currentChatroomId
}) {
  return (
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
            <MessageBubble msg={msg} currentUser={currentUser} darkMode={darkMode} />
          </motion.div>
        ))
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
}