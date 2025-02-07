import { useState } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { PhotoCamera, VideoLibrary, Add } from '@mui/icons-material';

function ProfileScreen() {
  const [previewImage, setPreviewImage] = useState('');
  const [bio, setBio] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedReels, setUploadedReels] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleHighlightUpload = (event, index, type) => {
    const file = event.target.files[0];
    if (file) {
      const newHighlights = [...highlights];
      newHighlights[index] = {
        src: URL.createObjectURL(file),
        type,
      };
      setHighlights(newHighlights);
    }
  };

  const handleSeparateUpload = (event, type) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      if (type === 'image') {
        const newImages = files.map(file => URL.createObjectURL(file));
        setUploadedImages(prevImages => [...prevImages, ...newImages]);
      } else if (type === 'reel') {
        const newReels = files.map(file => URL.createObjectURL(file));
        setUploadedReels(prevReels => [...prevReels, ...newReels]);
      }
    }
  };

  const addNewHighlightSlot = () => {
    setHighlights([...highlights, null]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <Box display="flex" alignItems="center" justifyContent="space-around" width="100%">
        <Box display="flex" alignItems="center" gap={3}>
          <Box textAlign="center">
            <Typography variant="h6">{uploadedImages.length}</Typography>
            <Typography variant="body2">Posts</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6">50</Typography>
            <Typography variant="body2">Followers</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6">30</Typography>
            <Typography variant="body2">Following</Typography>
          </Box>
        </Box>

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
      </Box>

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
                }}
              >
                {highlight ? (
                  <img
                    src={highlight.src}
                    alt={`Highlight ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <IconButton
                    component="label"
                    sx={{
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
                      onChange={(event) =>
                        handleHighlightUpload(event, index, 'image/video')
                      }
                      hidden
                    />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
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

      <Box mt={4} width="100%" textAlign="center">
        <Typography variant="h6">Upload Section</Typography>
        <Box display="flex" justifyContent="center" gap="20px" mt={2}>
          <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
            Upload Image
            <input type="file" accept="image/*" multiple onChange={(event) => handleSeparateUpload(event, 'image')} hidden />
          </Button>
          <Button variant="contained" component="label" startIcon={<VideoLibrary />}>
            Upload Reel
            <input type="file" accept="video/*" multiple onChange={(event) => handleSeparateUpload(event, 'reel')} hidden />
          </Button>
        </Box>
      </Box>

      <Box mt={4} width="100%">
        {uploadedImages.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6">Uploaded Images:</Typography>
            <Grid container spacing={2}>
              {uploadedImages.map((image, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <img
                    src={image}
                    alt={`Uploaded Image ${index + 1}`}
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {uploadedReels.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6">Uploaded Reels:</Typography>
            <Grid container spacing={2}>
              {uploadedReels.map((reel, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <video
                    src={reel}
                    controls
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ProfileScreen;