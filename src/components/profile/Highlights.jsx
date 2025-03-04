import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, IconButton, Typography, Avatar, Modal, TextField, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const Highlights = ({ userId, isOwnProfile }) => {
  const [highlights, setHighlights] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newHighlightTitle, setNewHighlightTitle] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (userId) {
      fetchHighlights();
    }
  }, [userId]);

  const fetchHighlights = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setHighlights(response.data);
      }
    } catch (error) {
      console.error("Error fetching highlights:", error);
      toast.error("Failed to load highlights. Please try again.");
    }
  };

  const handleAddHighlight = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights`,
        { story_id: selectedStoryId, title: newHighlightTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setHighlights([...highlights, response.data]);
        setOpenModal(false);
        setNewHighlightTitle("");
        toast.success("Highlight added successfully!");
      }
    } catch (error) {
      console.error("Error adding highlight:", error);
      toast.error("Failed to add highlight. Please try again.");
    }
  };

  const handleDeleteHighlight = async (highlightId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights/${highlightId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHighlights(highlights.filter((highlight) => highlight._id !== highlightId));
      toast.success("Highlight deleted successfully!");
    } catch (error) {
      console.error("Error deleting highlight:", error);
      toast.error("Failed to delete highlight. Please try again.");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Highlights
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
        {isOwnProfile && (
          <IconButton onClick={() => setOpenModal(true)}>
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        )}
        {highlights.map((highlight) => (
          <Box key={highlight._id} sx={{ textAlign: "center" }}>
            <Avatar
              src={highlight.story_image || "/default-avatar.png"}
              sx={{ width: 64, height: 64, cursor: "pointer" }}
            />
            <Typography variant="caption">{highlight.title}</Typography>
            {isOwnProfile && (
              <IconButton onClick={() => handleDeleteHighlight(highlight._id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Highlight
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={newHighlightTitle}
            onChange={(e) => setNewHighlightTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddHighlight}
            disabled={!newHighlightTitle || !selectedStoryId}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Highlights;