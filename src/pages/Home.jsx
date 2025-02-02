import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme => (theme.palette.mode === 'dark' ? 'gray.900' : 'white'),
      }}
    >
      <Typography variant="h3" component="h1" color="textPrimary" gutterBottom>
        Welcome to SocialApp
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Connect with friends and chat seamlessly.
      </Typography>
      <Box>
        <Button variant="contained" color="primary" component={Link} to="/login">
          Login
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/signup" sx={{ ml: 2 }}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}