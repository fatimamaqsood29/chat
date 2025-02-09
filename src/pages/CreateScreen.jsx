import React, { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { PhotoCamera, VideoLibrary } from "@mui/icons-material";
import { toast } from "react-toastify";

function CreateScreen({ onClose }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' or 'video'

  const handleFileUpload = (event, type) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (type === "image" && !selectedFile.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }
      if (type === "video" && !selectedFile.type.startsWith("video/")) {
        toast.error("Please upload a valid video file.");
        return;
      }

      setFile(URL.createObjectURL(selectedFile));
      setFileType(type);
    }
  };

  const handleShare = () => {
    if (file) {
      toast.success(
        `Your ${fileType === "image" ? "image" : "video"} has been shared!`
      );
      onClose();
    } else {
      toast.error("Please upload a file first.");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "500px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Create New Post
        </Typography>

        {/* File Upload Area */}
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "20px",
            mb: 2,
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {file ? (
            fileType === "image" ? (
              <img
                src={file}
                alt="Uploaded"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            ) : (
              <video
                src={file}
                controls
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            )
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Drag photos or videos here
              </Typography>
              <Box>
                <IconButton component="label">
                  <PhotoCamera sx={{ fontSize: "40px" }} />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFileUpload(e, "image")}
                  />
                </IconButton>
                <IconButton component="label">
                  <VideoLibrary sx={{ fontSize: "40px" }} />
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => handleFileUpload(e, "video")}
                  />
                </IconButton>
              </Box>
            </>
          )}
        </Box>

        {/* Select from Computer Button */}
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2 }}
        >
          Select from Computer
          <input
            type="file"
            accept={fileType === "image" ? "image/*" : "video/*"}
            hidden
            onChange={(e) => handleFileUpload(e, fileType || "image")}
          />
        </Button>

        {/* Share Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleShare}
        >
          Share
        </Button>

        {/* Close Button */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
}

export default CreateScreen;