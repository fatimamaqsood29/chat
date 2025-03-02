import { Dialog, DialogContent, IconButton, Typography, Box, TextField, Button, Menu, MenuItem } from "@mui/material"; // Import Menu and MenuItem
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const PostModal = ({ post, onClose, fetchPosts, token }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    setIsEditing(true); // Enable edit mode
    handleCloseMenu();
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts/${post._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Post deleted successfully");
        fetchPosts(); // Refresh the posts list
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
    handleCloseMenu();
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/posts/${post._id}`,
        { caption },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Post updated successfully");
        fetchPosts(); // Refresh the posts list
        setIsEditing(false); // Disable edit mode
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    }
  };

  return (
    <Dialog open={Boolean(post)} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <img
              src={post.image_url}
              alt={post.caption}
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
            />
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClickMenu}
              sx={{ position: 'absolute', top: 8, right: 8 }}
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
            {isEditing ? (
              <Box>
                <TextField
                  fullWidth
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleUpdatePost}>
                  Save
                </Button>
              </Box>
            ) : (
              <Typography variant="h6" gutterBottom>
                {post.caption}
              </Typography>
            )}
            <Typography variant="body1">
              {post.description || "No description available."}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};