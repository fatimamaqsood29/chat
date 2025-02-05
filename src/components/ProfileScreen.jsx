import { useState } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

function ProfileScreen() {
  const [previewImage, setPreviewImage] = useState('');
  const [bio, setBio] = useState('');
  const [highlights, setHighlights] = useState([]); // Store uploaded highlights

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleHighlightUpload = (event) => {
    const files = Array.from(event.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setHighlights([...highlights, ...filePreviews]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      {/* Profile Image Container */}
      <Box position="relative" display="inline-block">
        <Avatar
          src={previewImage || '/default-avatar.png'}
          sx={{ width: 150, height: 150 }}
        />
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'white',
            borderRadius: '50%',
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
      <Typography variant="h6" mt={2}>
        Update Profile Picture
      </Typography>

      {/* Bio Section */}
      <Box mt={4} width="100%">
        <Typography variant="h6">Bio</Typography>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write something about yourself..."
          rows="4"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'none',
          }}
        />
      </Box>

      {/* Highlights Section */}
      <Box mt={4} width="100%">
        <Typography variant="h6">Highlights</Typography>
        <Grid container spacing={2} mt={2} justifyContent="center">
          {highlights.map((highlight, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid #ddd',
                }}
              >
                <img
                  src={highlight}
                  alt={`Highlight ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Highlight Upload Button */}
        <Box mt={2} textAlign="center">
          <Button
            component="label"
            variant="contained"
            color="primary"
          >
            Add Highlight Image/Reel
            <input
              type="file"
              accept="image/,video/"
              multiple
              onChange={handleHighlightUpload}
              hidden
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileScreen;