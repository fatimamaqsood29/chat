import { Grid, Box, Typography, IconButton, Menu, MenuItem, TextField, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use environment variable for backend URL

export const PostsGrid = ({ uploadedImages, fetchPosts, token, setUploadedImages }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Open the menu and set the selected image
  const handleMenuOpen = (event, image) => {
    setAnchorEl(event.currentTarget);
    setSelectedImage(image);
    setNewTitle(image.title || ""); // Set the current title
    setNewContent(image.content || ""); // Set the current content
    setEditMode(false); // Reset edit mode when opening the menu
  };

  // Close the menu and reset states
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedImage(null);
    setEditMode(false);
    setNewTitle("");
    setNewContent("");
  };

  // Handle updating the post
  const handleUpdatePost = async () => {
    if (!selectedImage || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/posts/${selectedImage._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: newTitle, // Send the updated title
          content: newContent, // Send the updated content
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Get the response data

        // If the backend returns the updated post data, use it to update the state
        if (data.post) {
          const updatedPost = data.post;
          setUploadedImages((prevImages) =>
            prevImages.map((image) =>
              image._id === updatedPost._id ? updatedPost : image
            )
          );
        } else {
          // If the backend does not return the updated post data, refetch the posts
          console.warn("Updated post data is missing in the response. Refetching posts...");
          fetchPosts(); // Refetch posts to ensure the UI is in sync with the backend
        }

        handleMenuClose();
      } else {
        console.error("Failed to update post:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Handle deleting the post
  const handleDeletePost = async () => {
    if (!selectedImage || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/posts/${selectedImage._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.ok) {
        fetchPosts(); // Refresh the posts after deleting
        handleMenuClose();
      } else {
        console.error("Failed to delete post:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {uploadedImages.map((image) => (
        <Grid item xs={6} sm={4} md={3} key={image._id}>
          <Box
            sx={{
              border: "1px solid #ddd",
              padding: 2,
              textAlign: "center",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Menu button */}
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={(event) => handleMenuOpen(event, image)}
            >
              <MoreVertIcon />
            </IconButton>

            {/* Post image */}
            <img
              src={image.image_url}
              alt={image.title || "Post image"}
              style={{ width: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover", borderRadius: "8px" }}
            />

            {/* Post title */}
            <Typography variant="h6" mt={1}>
              {image.title}
            </Typography>

            {/* Post content */}
            <Typography variant="body2" mt={1}>
              {image.content}
            </Typography>
          </Box>
        </Grid>
      ))}

      {/* Edit/Delete menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {editMode ? (
          // Edit mode: Show text fields and save/cancel buttons
          <Box sx={{ p: 2, width: "250px" }}>
            <TextField
              fullWidth
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
            <Button onClick={handleUpdatePost} variant="contained" sx={{ mt: 2, mr: 1 }}>Save</Button>
            <Button onClick={handleMenuClose} variant="outlined" sx={{ mt: 2 }}>Cancel</Button>
          </Box>
        ) : (
          // Default mode: Show edit and delete options
          <>
            <MenuItem onClick={(e) => { e.stopPropagation(); setEditMode(true); }}>Edit</MenuItem>
            <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
          </>
        )}
      </Menu>
    </Grid>
  );
};