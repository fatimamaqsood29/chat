import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, TextField, Button, Avatar, CircularProgress, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

function EditProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userId = state?.userId;
  const initialProfile = state?.profileData || {
    name: localStorage.getItem("profile_name") || "",
    bio: localStorage.getItem("profile_bio") || "",
    profileImage: localStorage.getItem("profile_image") || "/default-avatar.png",
  };

  const [name, setName] = useState(initialProfile.name);
  const [bio, setBio] = useState(initialProfile.bio);
  const [profileImage, setProfileImage] = useState(initialProfile.profileImage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      toast.error("User not authenticated");
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.onerror = () => {
      toast.error("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim() || !bio.trim()) {
      toast.error("Name and Bio cannot be empty.");
      return;
    }

    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      toast.error("User not authenticated");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile/update`,
        { name, bio, profile_picture: profileImage },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      console.log("Update response:", response.data);

      localStorage.setItem("profile_name", name);
      localStorage.setItem("profile_bio", bio);
      localStorage.setItem("profile_image", profileImage || "/default-avatar.png");

      navigate(`/profile/${userId}`, {
        state: { profileData: { name, bio, profileImage } },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <ToastContainer />
      <Box position="relative" display="inline-block" mb={3}>
        <Avatar src={profileImage} sx={{ width: 100, height: 100 }} />
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <PhotoCamera />
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </IconButton>
      </Box>

      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
        disabled={isLoading}
      />
      <TextField
        fullWidth
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
        disabled={isLoading}
      />

      <Button variant="contained" color="primary" onClick={handleSave} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>
    </Box>
  );
}

export default EditProfileScreen;
