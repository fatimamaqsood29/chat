import { Avatar, Box, Button, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { useState, useEffect } from "react";
import {
  setCurrentChatroom,
  createChatroom,
} from '../../features/chatSlice';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; // For story upload icon

export const ProfileHeader = ({
  profileData,
  userId: propUserId, // userId passed as a prop
  isOwnProfile,
  loggedInUserId,
  onStoryUpload,
  onDeleteStory,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [stories, setStories] = useState([]);

  // Retrieve userId from localStorage if not passed as a prop
  const userId = propUserId || localStorage.getItem("user_id") || JSON.parse(localStorage.getItem("user"))?.id;

  // Fetch stories for the logged-in user
  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/stories/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // Array of stories
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Failed to fetch stories.");
      return [];
    }
  };

  // Load stories when the component mounts
  useEffect(() => {
    const loadStories = async () => {
      const storiesData = await fetchStories();
      setStories(storiesData);
    };

    if (isOwnProfile) {
      loadStories();
    }
  }, [isOwnProfile]);

  // Check the follow status only if viewing someone else's profile
  useEffect(() => {
    if (!isOwnProfile) {
      profileData?.followers?.forEach(followerId => {
        if (followerId === loggedInUserId) {
          setIsFollowing(true);
          return;
        }
      });
    }
  }, [profileData, loggedInUserId, isOwnProfile, userId]);

  const handleCreateChatroom = async (participantId) => {
    try {
      const result = await dispatch(createChatroom(participantId)).unwrap();
      if (result.chatroom_id) {
        toast.success('Chatroom created successfully');
        dispatch(setCurrentChatroom(result.chatroom_id));
      } else {
        toast.error(result.message || 'Failed to create chatroom');
      }
    } catch (error) {
      toast.error('Failed to create chatroom');
    }
  };

  // Handle follow/unfollow action
  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in to follow this user.");
        navigate("/login");
        return;
      }

      const endpoint = isFollowing
        ? `${import.meta.env.VITE_API_BASE_URL}/api/users/unfollow/${userId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/users/follow/${userId}`;

      const method = isFollowing ? "delete" : "post";

      const response = await axios[method](
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message) {
        setIsFollowing(!isFollowing);
        toast.success(
          isFollowing ? "You have unfollowed this user." : "You are now following this user."
        );
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast.error("Failed to follow/unfollow user. Please try again.");
    }
  };

  const handleMessageInteraction = () => {
    if (isFollowing) {
      handleCreateChatroom(userId);
    } else {
      toast.error("You must follow this user to send a message.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Profile Info Section */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={3}>
          {/* Profile Picture with Story Upload */}
          <Box position="relative">
            <Avatar
              src={profileData.profileImage}
              alt={profileData.name}
              sx={{ width: 80, height: 80 }}
            />
            {isOwnProfile && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": { backgroundColor: "primary.dark" },
                  p: 0.5, // Reduced padding for a smaller button
                }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 18 }} /> {/* Reduced icon size */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={onStoryUpload}
                  style={{ display: "none" }}
                />
              </IconButton>
            )}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {profileData.name}
            </Typography>
            <Typography variant="body1">{profileData.bio}</Typography>
          </Box>
        </Box>

        {/* Buttons Section */}
        {isOwnProfile ? (
          <Button
            variant="outlined"
            onClick={() =>
              navigate("/edit-profile", { state: { profileData, userId } })
            }
          >
            Edit Profile
          </Button>
        ) : (
          <Box display="flex" gap={2}>
            {/* Follow/Unfollow Button */}
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              color={isFollowing ? "secondary" : "primary"}
              onClick={handleFollow}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                width: "100px",
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>

            {/* Message Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleMessageInteraction}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Message
            </Button>
          </Box>
        )}
      </Box>

      {/* Stories Section */}
      <Box display="flex" gap={2} overflow="auto" py={2}>
        {stories.map((story) => (
          <Box
            key={story._id}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={() => {
              if (story.user?._id) {
                navigate(`/stories/${story.user._id}`);
              } else {
                console.error('Story user ID is undefined:', story);
                toast.error('Failed to load story. User ID is missing.');
              }
            }}
          >
            <Avatar
              src={story.imageUrl}
              alt="Story"
              sx={{ width: 60, height: 60, border: "2px solid", borderColor: "primary.main" }}
            />
            {isOwnProfile && (
              <Button
                variant="text"
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent story navigation
                  onDeleteStory(story._id);
                }}
              >
                Delete
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
