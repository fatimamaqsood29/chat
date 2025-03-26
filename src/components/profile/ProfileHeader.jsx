import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Typography, IconButton, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { setCurrentChatroom, createChatroom } from "../../features/chatSlice";

export const ProfileHeader = ({
  profileData,
  userId: propUserId,
  isOwnProfile,
  loggedInUserId,
  onStoryUpload,
  onDeleteStory,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [stories, setStories] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve userId from localStorage if not passed as a prop
  const userId =
    propUserId ||
    localStorage.getItem("user_id") ||
    JSON.parse(localStorage.getItem("user"))?.id;

  // Fetch stories for the logged-in user
  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/stories/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStories(response.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Failed to fetch stories.");
    }
  };

  // Fetch highlights for the logged-in user
  const fetchHighlights = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHighlights(response.data);
    } catch (error) {
      console.error("Error fetching highlights:", error);
      toast.error("Failed to load highlights.");
    } finally {
      setLoading(false);
    }
  };

  // Add a story to highlights
  const handleAddHighlight = async (storyId, title) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights`,
        { story_id: storyId, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchHighlights(); // Refresh highlights
    } catch (error) {
      console.error("Error adding highlight:", error);
      toast.error("Failed to add highlight.");
    }
  };

  // Delete a highlight
  const handleDeleteHighlight = async (highlightId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights/${highlightId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Highlight deleted successfully!");
      fetchHighlights(); // Refresh highlights
    } catch (error) {
      console.error("Error deleting highlight:", error);
      toast.error("Failed to delete highlight.");
    }
  };

  // Load stories when the component mounts
  useEffect(() => {
    if (isOwnProfile) {
      fetchStories();
      fetchHighlights();
    }
  }, [isOwnProfile]);

  // Check the follow status only if viewing someone else's profile
  useEffect(() => {
    if (!isOwnProfile) {
      profileData?.followers?.forEach((followerId) => {
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
        toast.success("Chatroom created successfully");
        dispatch(setCurrentChatroom(result.chatroom_id));
      } else {
        toast.error(result.message || "Failed to create chatroom");
      }
    } catch (error) {
      toast.error("Failed to create chatroom");
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

  // Handle story deletion
  const handleDeleteStory = async (storyId) => {
    try {
      await onDeleteStory(storyId);
      setStories((prevStories) => prevStories.filter((s) => s._id !== storyId)); // Remove deleted story
      toast.success("Story deleted successfully");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story.");
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

      {/* Highlights Section */}
      {isOwnProfile && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Highlights
          </Typography>
          <Box sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
            {highlights.map((highlight) => (
              <Box key={highlight._id} sx={{ textAlign: "center" }}>
                <Avatar
                  src={highlight.story_image}
                  sx={{
                    width: 80,
                    height: 80,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                  onClick={() => handleDeleteHighlight(highlight._id)}
                />
                <Typography variant="caption">{highlight.title}</Typography>
              </Box>
            ))}

            {/* Add Highlight Section */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Add to Highlights
              </Typography>
              <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
                {stories.map((story) => (
                  <Box key={story._id} sx={{ textAlign: "center" }}>
                    <Avatar
                      src={story.imageUrl}
                      sx={{
                        width: 60,
                        height: 60,
                        cursor: "pointer",
                        border: "2px solid",
                        borderColor: "primary.main",
                      }}
                      onClick={() => handleAddHighlight(story._id, "New Highlight")}
                    />
                    <Typography variant="caption">Story</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};