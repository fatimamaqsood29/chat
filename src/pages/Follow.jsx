import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Follow({ updateFollowers }) {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', bio: 'Loves hiking', avatar: 'https://via.placeholder.com/150', isFollowing: false },
    { id: 2, name: 'Bob', bio: 'Fan of photography', avatar: 'https://via.placeholder.com/150', isFollowing: false },
  ]);

  const navigate = useNavigate();

  const handleFollow = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));

    const updatedFollowerCount = users.filter(user => user.isFollowing).length + 1;
    updateFollowers(updatedFollowerCount);

    // Navigate to ChatScreen after following
    navigate(`/chat/${userId}`);
  };

  return (
    <Box p={4}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" textAlign="center" mb={4}>
          Follow Users
        </Typography>

        <Box maxWidth={500} mx="auto" display="flex" flexDirection="column" gap={2}>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <CardMedia
                  component="img"
                  image={user.avatar}
                  alt={user.name}
                  sx={{ width: 80, height: 80, borderRadius: '50%' }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    {user.name}
                  </Typography>
                  <Typography variant="body2">
                    {user.bio}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color={user.isFollowing ? 'secondary' : 'primary'}
                  onClick={() => handleFollow(user.id)}
                >
                  {user.isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
}