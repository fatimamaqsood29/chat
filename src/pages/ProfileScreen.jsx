import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Avatar, IconButton, Typography, Grid, Button } from '@mui/material';
import { PhotoCamera, VideoLibrary, Add } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

function ProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    bio: '',
    profileImage: '',
  });

  const [highlights, setHighlights] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedReels, setUploadedReels] = useState([]);

  useEffect(() => {
    if (state) {
      setProfileData({
        name: state.name || profileData.name,
        bio: state.bio || profileData.bio,
        profileImage: state.previewImage || profileData.profileImage,
      });
    }
  }, [state]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profileImage: URL.createObjectURL(file) });
      toast.success('Profile picture updated successfully!');
    }
  };

  const handleHighlightUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newHighlights = [...highlights];
      newHighlights[index] = URL.createObjectURL(file);
      setHighlights(newHighlights);
      toast.success('Highlight uploaded successfully!');
    }
  };

  const handleSeparateUpload = (event, type) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      if (type === 'image') {
        const newImages = files.map((file) => URL.createObjectURL(file));
        setUploadedImages((prev) => [...prev, ...newImages]);
        toast.success(`${files.length} image(s) uploaded successfully!`);
      } else if (type === 'reel') {
        const newReels = files.map((file) => URL.createObjectURL(file));
        setUploadedReels((prev) => [...prev, ...newReels]);
        toast.success(`${files.length} reel(s) uploaded successfully!`);
      }
    }
  };

  const addNewHighlightSlot = () => {
    setHighlights([...highlights, null]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Profile Stats and Avatar Section */}
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mt={4}>
        <Box display="flex" justifyContent="space-around" width="100%">
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
        <Box position="relative">
          <Avatar
            src={profileData.profileImage || '/default-avatar.png'}
            sx={{ width: 150, height: 150 }}
          />
          <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white' }}>
            <PhotoCamera />
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h4" mt={2}>{profileData.name}</Typography>
      <textarea
        value={profileData.bio}
        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
        placeholder="Write something about yourself..."
        rows="4"
        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'none' }}
      />

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        onClick={() =>
          navigate('/edit-profile', {
            state: {
              name: profileData.name,
              bio: profileData.bio,
              previewImage: profileData.profileImage,
            },
          })
        }
      >
        Edit Profile
      </Button>

      {/* Highlights Section */}
      <Box mt={4}>
        <Typography variant="h6">Highlights</Typography>
        <Grid container spacing={2} mt={2}>
          {highlights.map((highlight, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                  border: '2px solid #ddd',
                }}
              >
                {highlight ? (
                  <img src={highlight} alt={`Highlight ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <IconButton component="label">
                    <Add />
                    <input type="file" accept="image/*" hidden onChange={(event) => handleHighlightUpload(event, index)} />
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
      />
          </Grid>
        </Grid>
      </Box>

      {/* Upload Section */}
      <Box mt={4} textAlign="center">
        <Typography variant="h6">Upload Section</Typography>
        <Box display="flex" justifyContent="center" gap="20px" mt={2}>
          <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
            Upload Image
            <input type="file" accept="image/*" multiple hidden onChange={(event) => handleSeparateUpload(event, 'image')} />
          </Button>
          <Button variant="contained" component="label" startIcon={<VideoLibrary />}>
            Upload Reel
            <input type="file" accept="video/*" multiple hidden onChange={(event) => handleSeparateUpload(event, 'reel')} />
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