import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, CircularProgress, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Highlights = ({ userId, token }) => {
  const [highlights, setHighlights] = useState([]);
  const [stories, setStories] = useState([]); // State to store user stories
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
    fetchStories(); // Fetch user stories when the component mounts
  }, [userId]);

  // Fetch highlights from the API
  const fetchHighlights = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHighlights(response.data);
    } catch (error) {
      console.error('Error fetching highlights:', error);
      toast.error('Failed to load highlights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stories from the API
  const fetchStories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/stories/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStories(response.data); // Set the fetched stories in state
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories. Please try again.');
    }
  };

  // Add a story to highlights
  const handleAddHighlight = async (storyId, title) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights`,
        { story_id: storyId, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchHighlights(); // Refresh the highlights list
    } catch (error) {
      console.error('Error adding highlight:', error);
      toast.error('Failed to add highlight. Please try again.');
    }
  };

  // Delete a highlight
  const handleDeleteHighlight = async (highlightId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/highlights/${highlightId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Highlight deleted successfully!');
      fetchHighlights(); // Refresh the highlights list
    } catch (error) {
      console.error('Error deleting highlight:', error);
      toast.error('Failed to delete highlight. Please try again.');
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
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
        {/* Display existing highlights */}
        {highlights.map((highlight) => (
          <Box key={highlight._id} sx={{ textAlign: 'center' }}>
            <Avatar
              src={highlight.story_image}
              sx={{ width: 80, height: 80, cursor: 'pointer', border: '2px solid', borderColor: 'primary.main' }}
              onClick={() => handleDeleteHighlight(highlight._id)}
            />
            <Typography variant="caption">{highlight.title}</Typography>
          </Box>
        ))}

        {/* Add Highlight Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add to Highlights
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {stories.map((story) => (
              <Box key={story._id} sx={{ textAlign: 'center' }}>
                <Avatar
                  src={story.imageUrl}
                  sx={{ width: 60, height: 60, cursor: 'pointer', border: '2px solid', borderColor: 'primary.main' }}
                  onClick={() => handleAddHighlight(story._id, 'New Highlight')} // Add story to highlights
                />
                <Typography variant="caption">Story</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Highlights;