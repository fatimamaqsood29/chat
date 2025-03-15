import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Avatar, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Highlights = ({ userId, token }) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
  }, [userId]);

  const fetchHighlights = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHighlights(response.data);
    } catch (error) {
      console.error("Error fetching highlights:", error);
      toast.error("Failed to load highlights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Highlights
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
        {highlights.map((highlight) => (
          <Box key={highlight._id} sx={{ textAlign: "center" }}>
            <Avatar
              src={highlight.story_image}
              sx={{
                width: 80,
                height: 80,
                cursor: "pointer",
                border: "2px solid",
                borderColor: "primary.main",
              }}
            />
            <Typography variant="caption">{highlight.title}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Highlights;