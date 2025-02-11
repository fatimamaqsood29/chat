// src/api.js
import axios from 'axios';

// Use the environment variable for the base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/posts/users/${userId}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    formData.append('bio', profileData.bio);
    if (profileData.profile_picture) {
      formData.append('profile_picture', profileData.profile_picture);
    }
    const response = await axiosInstance.put('/api/users/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const followUser = async (userId) => {
  try {
    const response = await axiosInstance.post(`/api/users/follow/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};