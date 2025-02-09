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
import { PhotoCamera, VideoLibrary, Add, Edit } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedTab, setSelectedTab] = useState("post");

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    bio: localStorage.getItem("profileBio") || "",
    profileImage: localStorage.getItem("profileImage") || "",
  });

  const [highlights, setHighlights] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedReels, setUploadedReels] = useState([]);

  useEffect(() => {
    if (state) {
      setProfileData((prevData) => ({
        name: state.name || prevData.name,
        bio: state.bio || prevData.bio,
        profileImage: state.profileImage || prevData.profileImage,
      }));
    }
  }, [state]);

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
      event.target.value = "";
    }
  };

  const handleBioChange = (event) => {
    const updatedBio = event.target.value;
    setProfileData((prevData) => {
      const updatedData = { ...prevData, bio: updatedBio };
      localStorage.setItem("profileBio", updatedBio);
      return updatedData;
    });
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

  const handleSeparateUpload = (event, type) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      if (type === "image") {
        const newImages = files.map((file) => URL.createObjectURL(file));
        setUploadedImages((prev) => [...prev, ...newImages]);
        toast.success(`${files.length} image(s) uploaded successfully!`);
      } else if (type === "reel") {
        const newReels = files.map((file) => URL.createObjectURL(file));
        setUploadedReels((prev) => [...prev, ...newReels]);
        toast.success(`${files.length} reel(s) uploaded successfully!`);
      }
    }
  };

  const addNewHighlightSlot = () => {
    setHighlights([...highlights, null]);
  };

  const navigateToEditPage = () => {
    navigate("/edit-profile", { state: { profileData } });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Edit Button */}
      <Box display="flex" justifyContent="flex-end" width="100%">
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={navigateToEditPage}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Profile Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        mt={4}
      >
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
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
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

        <Box display="flex" justifyContent="space-around" width="50%">
          <Box textAlign="center">
            <Typography variant="h6">{uploadedImages.length}</Typography>
            <Typography variant="body2">Posts</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6">50</Typography>
            <Typography variant="body2">Followers</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6">30</Typography>
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

        {/* Upload Button */}
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={
              selectedTab === "post" ? <PhotoCamera /> : <VideoLibrary />
            }
          >
            Upload {selectedTab === "post" ? "Image" : "Reel"}
            <input
              type="file"
              accept={selectedTab === "post" ? "image/*" : "video/*"}
              multiple
              hidden
              onChange={(e) =>
                handleSeparateUpload(e, selectedTab === "post" ? "image" : "reel")
              }
            />
          </Button>
        </Box>

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
          <Typography variant="h6" textAlign="center" mt={4}>
            No {selectedTab === "post" ? "posts" : "reels"} yet
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ProfileScreen;