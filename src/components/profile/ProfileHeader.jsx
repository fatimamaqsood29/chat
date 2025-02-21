import { Avatar, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ProfileHeader = ({ profileData, userId, isOwnProfile }) => {
  const navigate = useNavigate();
  
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar
          src={profileData.profileImage}
          alt={profileData.name}
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {profileData.name}
          </Typography>
          <Typography variant="body1">{profileData.bio}</Typography>
        </Box>
      </Box>
      {isOwnProfile ? (
        <Button
          variant="outlined"
          onClick={() => navigate("/edit-profile", { state: { profileData, userId } })}
        >
          Edit Profile
        </Button>
      ) : (
        <Button variant="contained" color="primary">
          Follow
        </Button>
      )}
    </Box>
  );
};