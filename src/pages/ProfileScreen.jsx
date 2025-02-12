import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Avatar, Typography, Grid, Button, Tabs, Tab } from "@mui/material";

function ProfileScreen() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [selectedTab, setSelectedTab] = useState("post");
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    bio: "",
    profileImage: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    fetchProfileData();
    fetchUserPosts();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("User not authenticated");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `https://bases-pd-dg-mods.trycloudflare.com/api/users/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfileData({
        name: response.data.name,
        bio: response.data.bio,
        profileImage: response.data.profileImage || "/default-avatar.png",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `https://bases-pd-dg-mods.trycloudflare.com/api/posts/users/${userId}/posts`
      );
      if (Array.isArray(response.data)) {
        setUploadedImages(response.data);
        setTotalPosts(response.data.length);
      } else {
        setUploadedImages([]);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={profileData.profileImage}
            alt={profileData.name}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5">{profileData.name}</Typography>
            <Typography variant="body1">{profileData.bio}</Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate("/edit-profile", { state: { profileData } })}
        >
          Edit Profile
        </Button>
      </Box>

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
