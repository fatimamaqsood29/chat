import { List, ListItem, ListItemAvatar, ListItemText, Badge, Avatar } from '@mui/material';

export default function ChatList({ 
  filteredChatrooms, 
  currentUser, 
  currentChatroomId, 
  handleSelectChatroom, 
  darkMode = false,
  handleCreateChatroom
}) {
  if (!Array.isArray(filteredChatrooms)) {
    return null;
  }

  return (
    <List sx={{ overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
      {filteredChatrooms.map((chatroom) => {
        const user = chatroom.participants.find((p) => p._id !== currentUser.id);

        return (
          <ListItem
            key={chatroom._id}

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
                <Avatar 
                  src={user?.profile_picture || '/path/to/default-avatar.jpg'}
                  sx={{ width: 56, height: 56 }} 
                />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={user?.name || 'Unknown User'}
              secondary={chatroom.last_message?.message || 'No message'}
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
  );
}