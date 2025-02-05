import { useState } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { PhotoCamera, Add } from '@mui/icons-material';

function ProfileScreen() {
  const [previewImage, setPreviewImage] = useState('');
  const [bio, setBio] = useState('');
  const [highlights, setHighlights] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleHighlightUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newHighlights = [...highlights];
      newHighlights[index] = URL.createObjectURL(file);
      setHighlights(newHighlights);
    }
  };

  const addNewHighlightSlot = () => {
    setHighlights([...highlights, null]);
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
                  backgroundColor: '#f0f0f0',
                  border: '2px solid #ddd',
                  position: 'relative',
                }}
              >
                {highlight ? (
                  <img
                    src={highlight}
                    alt={`Highlight ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Add sx={{ fontSize: 40 }} />
                    <input
                      type="file"
                      accept="image/,video/"
                      onChange={(event) => handleHighlightUpload(event, index)}
                      hidden
                    />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
          {/* Add New Highlight Slot */}
          <Grid item>
            <IconButton
              onClick={addNewHighlightSlot}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#ddd',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Add sx={{ fontSize: 40 }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProfileScreen;