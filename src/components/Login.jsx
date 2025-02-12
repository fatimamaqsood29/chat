import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUser, FaLock } from 'react-icons/fa';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useThemeContext } from '../ThemeContext';
//import { useDispatch } from 'react-redux';

const loginSchema = z.object({
  
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { darkMode } = useThemeContext();

  const onSubmit = async (data) => {
    toast.loading('Logging in...');
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log('API Response:', result); // Debugging line
  
      toast.dismiss();
  
      if (response.ok) {
        const token = result.access_token;
  
        if (token) {
          localStorage.setItem('accessToken', token); // Store the correct token
          toast.success('Logged in successfully!');
          navigate('/home');
        } else {
          toast.error('Token missing. Please check the backend response.');
        }
      } else {
        toast.error(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred. Please try again.');
    }
  };
  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={darkMode ? 'background.default' : 'background.paper'}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400, bgcolor: darkMode ? 'grey.800' : 'white' }}>
        <Typography variant="h4" textAlign="center" gutterBottom color={darkMode ? 'grey.100' : 'text.primary'}>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
              InputProps={{
                endAdornment: <FaUser style={{ color: darkMode ? '#bbb' : '#777' }} />,
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              fullWidth
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              InputProps={{
                endAdornment: <FaLock style={{ color: darkMode ? '#bbb' : '#777' }} />,
              }}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" mt={2}>
          Don't have an account?{' '}
          <Button onClick={() => navigate('/signup')} variant="text" color="primary">
            Sign up
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}