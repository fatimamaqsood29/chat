import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Avatar,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ProfileScreen() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("post");
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem("profile_name") || "John Doe",
    bio: localStorage.getItem("profile_bio") || "",
    profileImage: localStorage.getItem("profile_image") || "/default-avatar.png",
  });
  const [profileFollowers, setProfileFollowers] = useState([]);
  const [profileFollowing, setProfileFollowing] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  // State for the modal dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "followers", "following", or "posts"

  useEffect(() => {
    // If coming from edit-profile with updated data, update state and localStorage
    if (location.state?.profileData) {
      const { name, bio, profileImage, followers, following } = location.state.profileData;
      setProfileData({ name, bio, profileImage });
      if (followers) setProfileFollowers(followers);
      if (following) setProfileFollowing(following);
      localStorage.setItem("profile_name", name);
      localStorage.setItem("profile_bio", bio);
      localStorage.setItem("profile_image", profileImage || "/default-avatar.png");
    } else {
      // Otherwise, fetch from API
      fetchProfileData();
    }
    fetchUserPosts();
  }, [userId, location.key]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("User not authenticated");
        navigate("/login");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        // Adjust based on your API’s structure
        const userData = response.data.user ? response.data.user : response.data;
        const updatedData = {
          name: userData.name || "John Doe",
          bio: userData.bio || "",
          profileImage: userData.profile_picture || "/default-avatar.png",
        };
        setProfileData(updatedData);
        // Assume the API returns arrays of full user objects for followers and following
        setProfileFollowers(userData.followers || []);
        setProfileFollowing(userData.following || []);
        localStorage.setItem("profile_name", updatedData.name);
        localStorage.setItem("profile_bio", updatedData.bio);
        localStorage.setItem("profile_image", updatedData.profileImage);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile. Please try again.");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/users/${userId}/posts`
      );
      if (Array.isArray(response.data)) {
        setUploadedImages(response.data);
        setTotalPosts(response.data.length);
      } else {
        setUploadedImages([]);
        setTotalPosts(0);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to load posts. Please try again.");
    }
  };

  // New helper functions to fetch followers and following details
  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/followers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setProfileFollowers(response.data);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to load followers. Please try again.");
    }
  };

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/following`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setProfileFollowing(response.data);
      }
    } catch (error) {
      console.error("Error fetching following:", error);
      toast.error("Failed to load following. Please try again.");
    }
  };

  // Updated handler to open the modal dialog
  const handleOpenDialog = async (type) => {
    if (type === "followers") {
      await fetchFollowers();
    } else if (type === "following") {
      await fetchFollowing();
    }
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType("");
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer />
      {/* Profile Header */}
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
            {/* Stats Section styled like Instagram Web */}
            <Box display="flex" gap={3} mt={3}>
              <Box sx={{ cursor: "pointer" }} onClick={() => handleOpenDialog("posts")}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {totalPosts}
                </Typography>
                <Typography variant="body2">Posts</Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }} onClick={() => handleOpenDialog("followers")}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {profileFollowers.length}
                </Typography>
                <Typography variant="body2">Followers</Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }} onClick={() => handleOpenDialog("following")}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {profileFollowing.length}
                </Typography>
                <Typography variant="body2">Following</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Button
          variant="outlined"
          onClick={() =>
            navigate("/edit-profile", { state: { profileData, userId } })
          }
        >
          Edit Profile
        </Button>
      </Box>

      {/* Tabs Section */}
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{ mt: 4 }}
      >
        <Tab value="post" label="Posts" />
      </Tabs>

      {selectedTab === "post" && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {uploadedImages.map((image) => (
            <Grid item xs={6} sm={4} md={3} key={image._id}>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  padding: 2,
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                <img
                  src={image.image_url}
                  alt={image.caption}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <Typography variant="body2" mt={1}>
                  {image.caption}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal Dialog for Followers/Following/Posts */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogType === "followers" && "Followers"}
          {dialogType === "following" && "Following"}
          {dialogType === "posts" && "Posts"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {(dialogType === "followers" || dialogType === "following") && (
            <List>
              {(dialogType === "followers" ? profileFollowers : profileFollowing).map((user, index) => (
                <ListItem key={user._id || user.id || index}>
                  <ListItemAvatar>
                    <Avatar src={user.profile_picture || "/default-avatar.png"} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={user.name || "Unknown"} 
                    secondary={user.email || ""} 
                  />
                </ListItem>
              ))}
            </List>
          )}
          {dialogType === "posts" && (
            <List>
              {uploadedImages.map((image, index) => (
                <ListItem key={image._id || index}>
                  <Avatar
                    variant="rounded"
                    src={image.image_url}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <ListItemText primary={image.caption || "No Caption"} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ProfileScreen;