import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  TextField,
  Card,
} from "@mui/material";
import { AddPhotoAlternate, Movie, CloudUpload } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useThemeContext } from "../ThemeContext";

function CreateScreen() {
  const navigate = useNavigate();
  const { darkMode } = useThemeContext();

  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "image" or "video"
  const [caption, setCaption] = useState("");

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setMediaType(type);
      toast.success(`${type === "image" ? "Image" : "Video"} selected successfully!`);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file before uploading.");
      return;
    }

    navigate("/profile", {
      state: {
        newPost: {
          type: mediaType,
          url: selectedFile,
          caption: caption,
        },
      },
    });

    toast.success("Post uploaded successfully!");
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

        {/* Media Selection */}
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
                onChange={(event) => handleFileChange(event, "image")}
              />
            </IconButton>
            <Typography textAlign="center" mt={1}>
              Add Image
            </Typography>
          </Grid>
          <Grid item>
            <IconButton component="label">
              <Movie sx={{ fontSize: 50, color: darkMode ? "#90caf9" : "#1976d2" }} />
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={(event) => handleFileChange(event, "video")}
              />
            </IconButton>
            <Typography textAlign="center" mt={1}>
              Add Video
            </Typography>
          </Grid>
        </Grid>

        {/* Preview Section */}
        {selectedFile && (
          <Box mt={4}>
            {mediaType === "image" ? (
              <img
                src={selectedFile}
                alt="Selected"
                style={{ width: "100%", maxHeight: 300, borderRadius: 8 }}
              />
            ) : (
              <video
                src={selectedFile}
                controls
                style={{ width: "100%", maxHeight: 300, borderRadius: 8 }}
              />
            )}
          </Box>
        )}

        {/* Caption Input */}
        <TextField
          label="Caption"
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          sx={{
            mt: 3,
            backgroundColor: darkMode ? "#303030" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
          }}
          InputLabelProps={{ style: { color: darkMode ? "#ffffff" : "#000000" } }}
          InputProps={{ style: { color: darkMode ? "#ffffff" : "#000000" } }}
        />

        {/* Upload Button */}
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={handleUpload}
          sx={{ mt: 3, backgroundColor: darkMode ? "#90caf9" : "#1976d2" }}
        >
          Upload
        </Button>
      </Card>
    </Box>
  );
}

export default CreateScreen;