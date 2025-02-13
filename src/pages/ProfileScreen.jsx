import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Avatar, Typography, Grid, Button, Tabs, Tab } from "@mui/material";
import { useSelector } from "react-redux";

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
  const [uploadedImages, setUploadedImages] = useState([]);

  // Retrieve followers and following from the redux store (or default to an empty array)
  const followers = useSelector((state) => state.follow.followers) || [];
  const following = useSelector((state) => state.follow.following) || [];
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    // If coming from edit-profile with updated data, update state and localStorage
    if (location.state?.profileData) {
      const { name, bio, profileImage } = location.state.profileData;
      setProfileData({ name, bio, profileImage });
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
        // Use the API's returned data (if nested under 'user', adjust accordingly)
        const userData = response.data.user ? response.data.user : response.data;
        const updatedData = {
          name: userData.name || "John Doe",
          bio: userData.bio || "",
          profileImage: userData.profile_picture || "/default-avatar.png",
        };
        setProfileData(updatedData);
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
            {/* Stats Section styled like Instagram Web with left margin */}
            <Box display="flex" gap={3} mt={3} ml={99}>
              <Box sx={{ cursor: "pointer" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {totalPosts}
                </Typography>
                <Typography variant="body2">Posts</Typography>
              </Box>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  navigate("/follow", { state: { tab: "followers" } })
                }
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {followers.length}
                </Typography>
                <Typography variant="body2">Followers</Typography>
              </Box>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  navigate("/follow", { state: { tab: "following" } })
                }
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {following.length}
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
    </Box>
  );
}

export default ProfileScreen;
