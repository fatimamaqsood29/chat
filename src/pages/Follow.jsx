import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFollower, addFollowing, removeFollower, removeFollowing } from '../features/followSlice';
import { Box, Button, Typography, Container, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Follow() {
  const dispatch = useDispatch();
  const followers = useSelector((state) => state.follow.followers);
  const following = useSelector((state) => state.follow.following);
  const handleAddFollower = () => {
    dispatch(addFollower({ 
      id: Date.now(), 
      username: `follower_${Date.now()}` 
    }));
  };  

  const handleAddFollowing = () => {
    dispatch(addFollowing({ id: Date.now(), username: `following_${Date.now()}` }));
  };

  const handleRemoveFollower = (id) => {
    dispatch(removeFollower(id));
  };

  const handleRemoveFollowing = (id) => {
    dispatch(removeFollowing(id));
  };

  return (
    <Container>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Follow Management
        </Typography>

        <Box sx={{ marginTop: 2 }}>
          <Button onClick={handleAddFollower} variant="contained" sx={{ margin: 1 }}>
            Add Follower
          </Button>
          <Button onClick={handleAddFollowing} variant="contained" sx={{ margin: 1 }}>
            Add Following
          </Button>
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5">Followers:</Typography>
          <List>
            {followers.map((follower) => (
              <ListItem key={follower.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{follower.username}</Typography>
                <IconButton onClick={() => handleRemoveFollower(follower.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" sx={{ marginTop: 2 }}>
            Following:
          </Typography>
          <List>
            {following.map((user) => (
              <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{user.username}</Typography>
                <IconButton onClick={() => handleRemoveFollowing(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
  );
}

export default Follow;