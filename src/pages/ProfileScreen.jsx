// src/pages/ProfileScreen.js
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { PhotoCamera, Add, Edit } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';


function ProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedTab, setSelectedTab] = useState("post");

  // Profile data
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    bio: localStorage.getItem("profileBio") || "",
    profileImage: localStorage.getItem("profileImage") || "",
  });

  // Social data
  // const [followers, setFollowers] = useState(
  //   JSON.parse(localStorage.getItem("followers")) || []
  // );
  // const [following, setFollowing] = useState(
  //   JSON.parse(localStorage.getItem("following")) || []
  // );
  const followers = useSelector((state) => state.follow.followers);
  const following = useSelector((state) => state.follow.following);


  // Posts data
  const [uploadedImages, setUploadedImages] = useState(
    JSON.parse(localStorage.getItem("uploadedImages")) || []
  );
  const [uploadedReels, setUploadedReels] = useState(
    JSON.parse(localStorage.getItem("uploadedReels")) || []
  );
  const [highlights, setHighlights] = useState([]);

  // When a new post is created on another page, update our posts list
  useEffect(() => {
    if (state?.newPost) {
      const { type, url } = state.newPost;
      if (type === "image" && !uploadedImages.includes(url)) {
        const newImages = [...uploadedImages, url];
        setUploadedImages(newImages);
        localStorage.setItem("uploadedImages", JSON.stringify(newImages));
      } else if (type === "video" && !uploadedReels.includes(url)) {
        const newReels = [...uploadedReels, url];
        setUploadedReels(newReels);
        localStorage.setItem("uploadedReels", JSON.stringify(newReels));
      }
      navigate(".", { replace: true, state: {} });
    }
  }, [state, navigate, uploadedImages, uploadedReels]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setProfileData((prevData) => {
        const updatedData = { ...prevData, profileImage: objectUrl };
        localStorage.setItem("profileImage", objectUrl);
        return updatedData;
      });
      toast.success("Profile picture updated successfully!");
      event.target.value = ""; // Allow re-uploading same file later
    }
  };

  const handleHighlightUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newHighlights = [...highlights];
      newHighlights[index] = URL.createObjectURL(file);
      setHighlights(newHighlights);
      toast.success("Highlight uploaded successfully!");
    }
  };

  const addNewHighlightSlot = () => {
    setHighlights([...highlights, null]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Profile Header */}
      <Box display="flex" justifyContent="flex-end" width="100%">
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate("/edit-profile", { state: { profileData } })}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Profile Info Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        mt={4}
      >
        {/* Avatar and Basic Info */}
        <Box display="flex" alignItems="center" gap={4} position="relative">
          <Avatar
            src={profileData.profileImage || "/default-avatar.png"}
            sx={{ width: 150, height: 150 }}
          />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 5,
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          >
            <PhotoCamera />
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </IconButton>
          <Box>
            <Typography variant="h4">{profileData.name}</Typography>
            <Typography
              variant="body1"
              mt={1}
              style={{ whiteSpace: "pre-line" }}
            >
              {profileData.bio ||
                "This is your bio. Write something about yourself!"}
            </Typography>
          </Box>
        </Box>

        {/* Stats Section */}
        <Box display="flex" justifyContent="space-around" width="50%">
          <Box textAlign="center">
            <Typography variant="h6">{uploadedImages.length}</Typography>
            <Typography variant="body2">Posts</Typography>
          </Box>
          <Box
            textAlign="center"
            sx={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/follow", { state: { tab: "followers" } })
            }
          >
            <Typography variant="h6">{followers.length}</Typography>
            <Typography variant="body2">Followers</Typography>
          </Box>
          <Box
            textAlign="center"
            sx={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/follow", { state: { tab: "following" } })
            }
          >
            <Typography variant="h6">{following.length}</Typography>
            <Typography variant="body2">Following</Typography>
          </Box>
        </Box>
      </Box>

      {/* Highlights Section */}
      <Box mt={4} width="100%">
        <Typography variant="h6">Highlights</Typography>
        <Grid container spacing={2} mt={2}>
          {highlights.map((highlight, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#f0f0f0",
                  border: "2px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {highlight ? (
                  <img
                    src={highlight}
                    alt={`Highlight ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <IconButton component="label" sx={{ p: 0 }}>
                    <Add sx={{ fontSize: 40 }} />
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => handleHighlightUpload(event, index)}
                    />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
          <Grid item>
            <IconButton
              onClick={addNewHighlightSlot}
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: "#ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Add sx={{ fontSize: 40 }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      {/* Posts/Reels Section */}
      <Box mt={4} width="100%">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Posts" value="post" />
          <Tab label="Reels" value="reel" />
        </Tabs>

        {/* Content Grid */}
        <Grid container spacing={2} mt={2}>
          {selectedTab === "post"
            ? uploadedImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <img
                    src={image}
                    alt={`Post ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Grid>
              ))
            : uploadedReels.map((reel, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <video
                    src={reel}
                    controls
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Grid>
              ))}
        </Grid>

        {((selectedTab === "post" && uploadedImages.length === 0) ||
          (selectedTab === "reel" && uploadedReels.length === 0)) && (
          <Typography variant="body1" textAlign="center" mt={2}>
            No {selectedTab === "post" ? "posts" : "reels"} yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ProfileScreen;