import { useState } from 'react';
import { Box, Avatar, IconButton, Typography } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

function ProfileScreen() {
  const [previewImage, setPreviewImage] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      {/* Profile Image Container */}
      <Box position="relative" display="inline-block">
        <Avatar
          src={previewImage || '/default-avatar.png'} // Use a default avatar image in the public folder
          sx={{ width: 150, height: 150 }}
        />
        {/* Camera Icon Button */}
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
    </Box>
  );
}

export default ProfileScreen;