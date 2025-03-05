import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';
import {
  ProfileHeader,
  ProfileStats,
  TabsSection,
  PostsGrid,
  FollowDialog,
} from '../components/profile';
import { useDispatch, useSelector } from 'react-redux';
import { uploadStory, fetchFollowingStories, deleteStory } from '../features/storySlice';

function ProfileScreen() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const loggedInUserId = localStorage.getItem('user_id');
  const token = localStorage.getItem('access_token');
  const isOwnProfile = loggedInUserId === userId;

  const [selectedTab, setSelectedTab] = useState('post');
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('profile_name') || 'John Doe',
    bio: localStorage.getItem('profile_bio') || '',
    profileImage: localStorage.getItem('profile_image') || '/default-avatar.png',
  });
  const [profileFollowers, setProfileFollowers] = useState([]);
  const [profileFollowing, setProfileFollowing] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  const { stories, loading: storiesLoading, error: storiesError } = useSelector((state) => state.story); // Get stories from Redux store

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loggedInUserId || !token) {
      toast.error('Please log in to view this profile.');
      navigate('/login');
    }
  }, [loggedInUserId, token, navigate]);

  // Fetch profile data and stories
  useEffect(() => {
    if (location.state?.profileData) {
      const { name, bio, profileImage, followers, following } = location.state.profileData;
      setProfileData(location.state.profileData);
      if (followers) setProfileFollowers(followers);
      if (following) setProfileFollowing(following);
      localStorage.setItem('profile_name', name);
      localStorage.setItem('profile_bio', bio);
      localStorage.setItem('profile_image', profileImage || '/default-avatar.png');
    } else {
      fetchProfileData();
    }
    fetchUserPosts();
    dispatch(fetchFollowingStories()); // Fetch stories
  }, [userId, location.key]);

  // Fetch profile data from the API
  const fetchProfileData = async () => {
    try {
      if (!token) {
        toast.error('User not authenticated');
        navigate('/login');
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        const userData = response.data.user || response.data;
        const updatedData = {
          name: userData.name || 'John Doe',
          bio: userData.bio || '',
          profileImage: userData.profile_picture || '/default-avatar.png',
        };
        setProfileData(userData);
        setProfileFollowers(userData.followers || []);
        setProfileFollowing(userData.following || []);
        localStorage.setItem('profile_name', updatedData.name);
        localStorage.setItem('profile_bio', updatedData.bio);
        localStorage.setItem('profile_image', updatedData.profileImage);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile. Please try again.');
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/users/${userId}/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setUploadedImages(response.data);
        setTotalPosts(response.data.length);
      } else {
        setUploadedImages([]);
        setTotalPosts(0);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to load posts. Please try again.');
    }
  };

  // Handle story upload
  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await dispatch(uploadStory(file)).unwrap();
        toast.success('Story uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload story');
      }
    }
  };

  // Handle story deletion
  const handleDeleteStory = async (storyId) => {
    try {
      await dispatch(deleteStory(storyId)).unwrap();
      toast.success('Story deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  // Open follow dialog (followers or following)
  const handleOpenDialog = async (type) => {
    if (type === 'followers') {
      await fetchFollowers();
    }
    if (type === 'following') {
      await fetchFollowing();
    }
    setDialogType(type);
    setOpenDialog(true);
  };

  // Fetch followers
  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/followers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setProfileFollowers(response.data);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast.error('Failed to load followers. Please try again.');
    }
  };

  // Fetch following
  const fetchFollowing = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/following`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setProfileFollowing(response.data);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
      toast.error('Failed to load following. Please try again.');
    }
  };

  // Close follow dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer />
      <ProfileHeader
        profileData={profileData}
        userId={userId}
        isOwnProfile={isOwnProfile}
        loggedInUserId={loggedInUserId}
        onStoryUpload={handleStoryUpload} // Pass story upload handler
        stories={stories} // Pass stories data
        onDeleteStory={handleDeleteStory} // Pass story delete handler
      />
      <ProfileStats
        totalPosts={totalPosts}
        followersCount={profileFollowers.length}
        followingCount={profileFollowing.length}
        onStatClick={handleOpenDialog}
      />
      <TabsSection
        selectedTab={selectedTab}
        onTabChange={(e, newValue) => setSelectedTab(newValue)}
      />
      {selectedTab === 'post' && (
        <PostsGrid
          uploadedImages={uploadedImages}
          fetchPosts={fetchUserPosts}
          token={token}
          setUploadedImages={setUploadedImages}
        />
      )}
      <FollowDialog
        open={openDialog}
        type={dialogType}
        onClose={handleCloseDialog}
        followers={profileFollowers}
        following={profileFollowing}
      />
    </Box>
  );
}

export default ProfileScreen;