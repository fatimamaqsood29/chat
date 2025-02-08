import { useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function EditProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [previewImage, setPreviewImage] = useState(state?.previewImage || "");
  const [bio, setBio] = useState(state?.bio || "");
  const [name, setName] = useState(state?.name || "");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      toast.success("Profile picture updated successfully!");
    }
  };

  const handleSaveChanges = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    toast.success("Profile updated successfully!");
    navigate("/profile", { state: { previewImage, bio, name } });
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
