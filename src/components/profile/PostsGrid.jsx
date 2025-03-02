import { Grid, Box, Typography, IconButton, Menu, MenuItem } from "@mui/material"; // Import Menu and MenuItem
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PostModal } from "./PostModel"; // Import the PostModal component

export const PostsGrid = ({ uploadedImages, fetchPosts, token, setUploadedImages }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    // Redirect to edit functionality in the modal
    setSelectedPost(selectedPost); // Open the modal with the selected post
    handleCloseMenu();
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts/${selectedPost._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Post deleted successfully");
        fetchPosts(); // Refresh the posts list
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
    handleCloseMenu();
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
            }}
          >
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(event) => handleClickMenu(event, image)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={openMenu}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleEditPost}>Edit</MenuItem>
              <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
            </Menu>
            <img
              src={image.image_url}
              alt={image.caption}
              style={{ width: "100%", borderRadius: "8px" }}
              onClick={() => setSelectedPost(image)}
            />
            <Typography variant="body2" mt={1}>
              {image.caption}
            </Typography>
          </Box>
        </Grid>
      ))}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          fetchPosts={fetchPosts}
          token={token}
        />
      )}
    </Grid>
  );
};