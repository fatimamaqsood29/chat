import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, TextField, Button, Avatar } from "@mui/material";

function EditProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userId = state?.userId;
  const initialProfile = state?.profileData || { name: "", bio: "", profileImage: "" };

  const [name, setName] = useState(initialProfile.name);
  const [bio, setBio] = useState(initialProfile.bio);
  const [profileImage, setProfileImage] = useState(initialProfile.profileImage);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      toast.error("User not authenticated");
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      toast.error("User not authenticated");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile/update`,
        { name, bio, profileImage },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      toast.success("Profile updated successfully!");
      localStorage.setItem("profile_image", profileImage); // Store profile image in local storage
      localStorage.setItem("profile_name", name); // Store profile name in local storage
      localStorage.setItem("profile_bio", bio); // Store profile bio in local storage
      setTimeout(() => navigate(`/profile/${userId}`), 1000); // Navigate back to profile
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile.");
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer />
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={profileImage} sx={{ width: 80, height: 80 }} />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </Box>

      <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} multiline rows={3} sx={{ mb: 2 }} />

      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
}

export default EditProfileScreen;