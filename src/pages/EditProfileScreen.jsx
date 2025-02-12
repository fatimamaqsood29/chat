import { useState } from "react";
import { Box, Avatar, IconButton, Typography, TextField, Button } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function EditProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.profileData || {};
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [previewImage, setPreviewImage] = useState(initialData.profileImage || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [name, setName] = useState(initialData.name || "");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setSelectedFile(file);
      toast.info("Image preview updated.");
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (selectedFile) {
      formData.append("profile_picture", selectedFile);
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(`${API_BASE_URL}/api/refresh-token`, {
            refreshToken,
          });

          localStorage.setItem("token", refreshResponse.data.token);

          await axios.put(
            `${API_BASE_URL}/api/users/profile/update`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${refreshResponse.data.token}`,
              },
            }
          );
          toast.success("Profile updated successfully after token refresh!");
        } catch (refreshError) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box position="relative" display="inline-block">
        <Avatar
          src={previewImage || "/default-avatar.png"}
          sx={{ width: 150, height: 150 }}
        />
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        >
          <PhotoCamera />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </IconButton>
      </Box>

      <Box mt={4} width="100%">
        <Typography variant="h6">Name</Typography>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          fullWidth
          variant="outlined"
        />
      </Box>

      <Box mt={4} width="100%">
        <Typography variant="h6">Bio</Typography>
        <TextField
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write something about yourself..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
        />
      </Box>

      <Button variant="contained" onClick={handleSaveChanges} sx={{ mt: 4 }}>
        Save Changes
      </Button>
    </Box>
  );
}

export default EditProfileScreen;