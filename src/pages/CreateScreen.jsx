import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  TextField,
  Card,
} from "@mui/material";
import { AddPhotoAlternate, CloudUpload } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../features/postSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useThemeContext } from "../ThemeContext";

function CreateScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useThemeContext();

  // Get userId from Redux (or however you manage auth state)
  const userId = useSelector((state) => state.auth.user.id);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [caption, setCaption] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      toast.success("Image selected successfully!");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption) {
      toast.error("Please select an image and enter a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("caption", caption);

    try {
      const resultAction = await dispatch(createPost(formData));

      if (createPost.fulfilled.match(resultAction)) {
        const postId = resultAction.payload.postId;
        console.log("Post created successfully with ID:", postId); // Log postId

        toast.success("Post uploaded successfully!");
        navigate(`/profile/${userId}`);
      } else {
        throw new Error(resultAction.payload || "Failed to upload post.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload post.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={4}
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          padding: 4,
          boxShadow: 3,
          backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" mb={3} color={darkMode ? "#ffffff" : "#000000"}>
          Create New Post
        </Typography>

        {/* Image Selection */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <IconButton component="label">
              <AddPhotoAlternate
                sx={{ fontSize: 50, color: darkMode ? "#90caf9" : "#1976d2" }}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </IconButton>
            <Typography textAlign="center" mt={1}>
              Add Image
            </Typography>
          </Grid>
        </Grid>

        {/* Preview Section */}
        {filePreview && (
          <Box mt={4}>
            <img
              src={filePreview}
              alt="Selected"
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Box>
        )}

        {/* Caption Input */}
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: darkMode ? "#90caf9" : "#1976d2",
              },
            },
          }}
        />

        {/* Upload Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<CloudUpload />}
          sx={{ mt: 3 }}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Card>
    </Box>
  );
}

export default CreateScreen;
