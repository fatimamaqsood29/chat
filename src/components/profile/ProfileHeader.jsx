import { Avatar, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { useState, useEffect } from "react";
import {
  setCurrentChatroom,
  createChatroom,
} from '../../features/chatSlice';

export const ProfileHeader = ({ profileData, userId, isOwnProfile, loggedInUserId }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  // Check the follow status only if viewing someone else's profile
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/is-following/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    if (!isOwnProfile) {
      profileData?.followers?.map(followerId => {
        if (followerId == loggedInUserId) {
          setIsFollowing(true);
          return;
        }
      })
      // checkFollowStatus();
    }
  }, []);

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
      // navigate(`/chat/${userId}`)
    } else {
      toast.error("You must follow this user to send a message.");
    }
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar
          src={profileData.profileImage}
          alt={profileData.name}
          sx={{ width: 80, height: 80 }}
        />
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
  );
};