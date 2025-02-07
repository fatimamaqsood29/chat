import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Avatar,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';

function Second() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'John Doe',
      avatar: '/default-avatar.png',
      media: '/example-image.jpg', // Replace with real image/reel URL
      type: 'image', // 'image' or 'reel'
      likes: 10,
      liked: false,
      comments: [],
    }
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Home Feed
      </Typography>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={post.avatar} />
                  <Typography variant="h6">{post.user}</Typography>
                </Box>
              </CardContent>
              <CardMedia
                component={post.type === 'image' ? 'img' : 'video'}
                src={post.media}
                controls={post.type === 'reel'}
                alt="Post media"
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton onClick={() => handleLike(post.id)}>
                    {post.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                  <Typography>{post.likes} Likes</Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="h6">Comments:</Typography>
                  {post.comments.map((comment, index) => (
                    <Typography key={index} variant="body2">
                      {comment}
                    </Typography>
                  ))}
                </Box>
                <Box mt={2} display="flex" gap={2}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Write a comment..."
                    fullWidth
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        handleAddComment(post.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <IconButton>
                    <ChatBubbleOutline />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Second;